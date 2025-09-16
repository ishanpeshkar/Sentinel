from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
import logging
from typing import List

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Define the request body to accept a list of texts
class ReviewList(BaseModel):
    reviews: List[str]

# Load the summarization pipeline from Hugging Face.
# This is a more powerful (and larger) model than the sentiment one.
# It will be downloaded and cached on the first run.
try:
    logger.info("Loading summarization model...")
    # 'bart-large-cnn' is excellent for summarizing news-like text.
    summarizer = pipeline("summarization", model="t5-base")
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load model: {e}")
    summarizer = None

@app.get("/")
def read_root():
    return {"status": "Summarization Service is running."}

@app.post("/summarize")
def summarize_reviews(review_list: ReviewList):
    if not summarizer:
        return {"error": "Summarization model is not available."}
    
    if not review_list.reviews:
        return {"summary": "No reviews available to generate a summary."}

    # Combine all reviews into a single block of text for the model
    full_text = " ".join(review_list.reviews)
    
    # Cap the text length to avoid overwhelming the model
    # The model has a max token limit, so this is a safeguard.
    max_input_length = 1024
    if len(full_text) > max_input_length * 4: # Heuristic for characters vs tokens
        full_text = full_text[:max_input_length * 4]

    try:
        logger.info(f"Generating summary for text of length {len(full_text)}...")
        # We set min/max length for a concise summary.
        summary_result = summarizer(full_text, max_length=100, min_length=20, do_sample=False)
        summary_text = summary_result[0]['summary_text']
        
        logger.info(f"Summary generated successfully.")
        return {"summary": summary_text}
    except Exception as e:
        logger.error(f"Error during summarization: {e}")
        return {"error": "Failed to generate summary."}