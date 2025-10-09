import os
import tempfile
import librosa
import numpy as np
from transformers import pipeline
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = "openai/whisper-base"

# Initialize the ASR pipeline
asr_pipeline = pipeline(
    "automatic-speech-recognition",
    model=MODEL_ID,
    token=HF_TOKEN
)

def transcribe_audio(file_like):
    try:
        # Handle bytes data by saving to temporary file and loading with librosa
        if isinstance(file_like, bytes):
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_file:
                temp_file.write(file_like)
                temp_file_path = temp_file.name
            
            # Load audio with librosa (handles more formats without FFmpeg)
            audio, sr = librosa.load(temp_file_path, sr=16000)
            
            # Transcribe the audio array
            result = asr_pipeline(audio, return_timestamps=True)
            
            # Clean up temporary file
            os.unlink(temp_file_path)
            
            return result["text"]
        else:
            # Handle file objects or file paths
            if isinstance(file_like, str):
                # Load audio with librosa
                audio, sr = librosa.load(file_like, sr=16000)
                result = asr_pipeline(audio, return_timestamps=True)
            else:
                # Handle file objects
                if hasattr(file_like, "seek"):
                    file_like.seek(0)
                result = asr_pipeline(file_like, return_timestamps=True)
            return result["text"]
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        return None
