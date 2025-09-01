from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Define the request body structure using Pydantic
class ReviewText(BaseModel):
    text: str

# Load the sentiment analysis pipeline from Hugging Face
# This model is lightweight and effective for sentiment classification.
# The model will be downloaded and cached the first time the service starts.
try:
    logger.info("Loading sentiment analysis model...")
    sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load model: {e}")
    sentiment_pipeline = None

@app.get("/")
def read_root():
    return {"status": "Sentiment Inference Service is running."}

@app.post("/analyze")
def analyze_sentiment(review: ReviewText):
    if not sentiment_pipeline:
        return {"error": "Model is not available."}
        
    try:
        logger.info(f"Analyzing text: '{review.text[:50]}...'")
        result = sentiment_pipeline(review.text)[0]
        
        # The model returns 'POSITIVE' or 'NEGATIVE'. We'll map this to a score.
        sentiment_score = 0.0
        if result['label'] == 'POSITIVE':
            sentiment_score = result['score']
        elif result['label'] == 'NEGATIVE':
            sentiment_score = -result['score']
            
        logger.info(f"Analysis result: {result['label']} with score {result['score']}")
        
        return {
            "label": result['label'],
            "score": sentiment_score # A single value from -1.0 to 1.0
        }
    except Exception as e:
        logger.error(f"Error during analysis: {e}")
        return {"error": "Failed to analyze text."}