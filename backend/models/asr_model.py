import os
import tempfile
import librosa
import numpy as np
from transformers import pipeline
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = "openai/whisper-base"

asr_pipeline = pipeline(
    "automatic-speech-recognition",
    model=MODEL_ID,
    token=HF_TOKEN
)

def transcribe_audio(file_like, return_timestamps=True):
    try:
        if hasattr(file_like, 'read'):
            audio_data = file_like.read()
            file_like.seek(0) 
        elif isinstance(file_like, bytes):
            audio_data = file_like
        else:
            audio_data = file_like
        
        result = asr_pipeline(
            audio_data,
            return_timestamps=return_timestamps,
            chunk_length=30,
            stride_length=5
        )

        if isinstance(result, dict):
            if "error" in result:
                print(f"Transcription error: {result['error']}")
                return None
            return result.get("text", "")
        elif isinstance(result, list) and len(result) > 0:
            if isinstance(result[0], dict):
                return result[0].get("text", "")
            else:
                return str(result[0])
        else:
            return str(result)
            
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        return None

def get_available_models():
    return ["tiny", "base", "small", "medium", "large"]

def get_model_info():
    return {
        "model_id": MODEL_ID,
        "model_type": "whisper",
        "pipeline_type": "automatic-speech-recognition"
    }
