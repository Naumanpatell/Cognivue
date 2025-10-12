import os
from models.asr_model import transcribe_audio
from utils.supabase_clients import supabase

def transcribe_from_supabase_bytes(bucket_name: str, file_path: str):
    try:
        # Download the file from Supabase storage as bytes
        response = supabase.storage.from_(bucket_name).download(file_path)
        
        # Pass bytes directly to existing transcribe_audio function
        result = transcribe_audio(response)
        
        return result
    except Exception as e:
        print(f"Error downloading or transcribing from Supabase: {e}")
        return None

# Test with Supabase storage
bucket_name = "user_videos"  # bucket name
filename = "LOVER$ ROCKY.mp3"  # Just the filename

print(f"Downloading audio from Supabase: {bucket_name}/{filename}")
result = transcribe_from_supabase_bytes(bucket_name, filename)
print(f"Transcription result: {result}")