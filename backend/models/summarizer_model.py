import os
from transformers import pipelines
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = "facebook/bart-large-cnn"

summarizer = pipelines(
    "summarization",
    model = MODEL_ID,
    token = HF_TOKEN
)

def summarization (text, max_length, min_length):
    if not text or text.split():
        return "No text provided for summarization"
    
    try:
        summary = summarizer(
            text,
            max_length = max_length,
            min_length = min_length
        )
        return summary[0]["summary_text"]
    except Exception as e:
        print("Summarization Failed")
        return None 