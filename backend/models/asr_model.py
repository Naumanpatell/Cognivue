import os
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

client = InferenceClient(HF_TOKEN)

ModelId = "openai/whisper-large-v3"
def transcribe_audio(audio_path):
    try:
        with open(audio_path, "rb") as audio:
            transcription = client.automatic_speech_recognition(
                audio=audio,
                model=ModelId,
                language="english",
            )
            return transcription["text"]
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        return None