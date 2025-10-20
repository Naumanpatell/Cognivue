import os
from transformers import pipeline
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = "facebook/bart-large-cnn"

summarizer = pipeline(
    "summarization",
    model = MODEL_ID,
    token = HF_TOKEN
)

def summarize_text(text, max_length, min_length):
    if not text or not text.strip():
        return "No text provided for summarization"
    
    try:
        summary = summarizer(
            text,
            max_length = max_length,
            min_length = min_length
        )
        return summary[0]["summary_text"]
    except Exception as e:
        print(f"Summarization Failed {e}")
        return None 

def get_available_summarizers():
    return ["facebook/bart-large-cnn", "google/pegasus-xsum", "t5-small"]

