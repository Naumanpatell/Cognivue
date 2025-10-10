import os
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = "openai/whisper-large-v3"

# Initialize client with explicit model and token
client = InferenceClient(model=MODEL_ID, token=HF_TOKEN)

def transcribe_audio(file_like):
    try:
        if hasattr(file_like, "seek"):
            file_like.seek(0)
        transcription = client.automatic_speech_recognition(
            audio=file_like,
            model=MODEL_ID,
            language="english",
        )
        if isinstance(transcription, dict):
            return transcription.get("text")
        return str(transcription)
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        return None