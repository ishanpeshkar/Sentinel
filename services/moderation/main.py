from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Define the request body structure
class Content(BaseModel):
    text: str

# Load a toxicity classification model from Hugging Face.
# This model is specifically trained to detect toxic comments.
try:
    logger.info("Loading toxicity detection model...")
    # This model is robust and provides clear labels.
    toxicity_classifier = pipeline(
        "text-classification",
        model="unitary/toxic-bert"
    )
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load model: {e}")
    toxicity_classifier = None

@app.get("/")
def read_root():
    return {"status": "Moderation Service is running."}

@app.post("/moderate")
def moderate_content(content: Content):
    if not toxicity_classifier:
        # Fail safe: if the model is down, assume content is not toxic
        # to avoid blocking legitimate reviews. Log an error.
        logger.error("Moderation model is not available. Approving content by default.")
        return {"is_toxic": False, "score": 0.0, "label": "MODEL_UNAVAILABLE"}
    
    try:
        text_to_check = content.text
        logger.info(f"Moderating text: '{text_to_check[:50]}...'")
        
        result = toxicity_classifier(text_to_check)[0]
        
        # The model returns a 'LABEL_1' for toxic and 'LABEL_0' for non-toxic.
        is_toxic = True if result['label'] == 'toxic' else False
        
        logger.info(f"Moderation result: Label={result['label']}, Score={result['score']:.4f}")

        return {
            "is_toxic": is_toxic,
            "score": result['score'],
            "label": result['label']
        }
    except Exception as e:
        logger.error(f"Error during moderation: {e}")
        # Again, fail safe in case of an unexpected error during processing.
        return {"is_toxic": False, "score": 0.0, "label": "PROCESSING_ERROR"}