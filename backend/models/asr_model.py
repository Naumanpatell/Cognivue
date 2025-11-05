import os
import tempfile
import librosa
from transformers import pipeline
from dotenv import load_dotenv
from concurrent.futures import ProcessPoolExecutor
import time

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = "openai/whisper-tiny"

# Create a global pipeline for sequential transcription
asr_pipeline = pipeline(
    "automatic-speech-recognition",
    model=MODEL_ID,
    token=HF_TOKEN    
)

def create_asr_pipeline():
    """Create a new ASR pipeline for each parallel worker."""
    return pipeline(
        "automatic-speech-recognition",
        model=MODEL_ID,
        token=HF_TOKEN  
    )

def load_audio(file_like):
    """Handles uploaded file objects or raw bytes safely."""
    tmp_file = None
    try:
        if hasattr(file_like, 'read') or isinstance(file_like, bytes):
            tmp_file = tempfile.NamedTemporaryFile(suffix='.wav', delete=False)
            if hasattr(file_like, 'read'):
                file_like.seek(0)
                tmp_file.write(file_like.read())
            else:
                tmp_file.write(file_like)
            tmp_file.close()
            path = tmp_file.name
        else:
            path = file_like

        audio_data, sample_rate = librosa.load(path, sr=16000)
        return audio_data, sample_rate

    finally:
        if tmp_file:
            try: os.unlink(tmp_file.name)
            except: pass

def transcribe_audio_sequential(file_like):
    """Sequential transcription."""
    audio_data, _ = load_audio(file_like)
    result = asr_pipeline(audio_data)
    return result["text"] if isinstance(result, dict) else str(result)

def split_audio(audio_data, sample_rate, segment_length):
    segment_samples = int(segment_length * sample_rate)
    return [
        (i, audio_data[i:i + segment_samples])
        for i in range(0, len(audio_data), segment_samples)
    ]

def transcribe_segment(args):
    index, segment = args
    try:
        p = create_asr_pipeline()
        result = p(segment)
        text = result["text"] if isinstance(result, dict) else str(result)
        return index, text
    except Exception:
        return index, ""

def transcribe_audio_parallel(file_like, num_processes=6, segment_length=15):
    audio_data, sample_rate = load_audio(file_like)
    duration = len(audio_data) / sample_rate

    if duration <= segment_length:
        return transcribe_audio_sequential(file_like)

    segments = split_audio(audio_data, sample_rate, segment_length)

    start = time.time()
    with ProcessPoolExecutor(max_workers=num_processes) as executor:
        results = executor.map(transcribe_segment, segments)
    print(f"Parallel processing completed in {time.time() - start:.2f}s")

    results = sorted(results, key=lambda x: x[0])
    text = " ".join(r[1] for r in results if r[1].strip())

    return text if text.strip() else transcribe_audio_sequential(file_like)

def get_model_info():
    return {
        "model_id": MODEL_ID,
        "model_type": "whisper",
        "pipeline_type": "automatic-speech-recognition"
    }

def get_available_asr_models():
    return [
        "openai/whisper-tiny",
        "openai/whisper-small",
        "openai/whisper-medium",
        "openai/whisper-large"
    ]

