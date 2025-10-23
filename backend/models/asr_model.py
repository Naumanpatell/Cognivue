import os
import tempfile
import librosa
import numpy as np
from transformers import pipeline
from dotenv import load_dotenv
import multiprocessing
from concurrent.futures import ProcessPoolExecutor
import time

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = "openai/whisper-tiny"

asr_pipeline = pipeline(
    "automatic-speech-recognition",
    model=MODEL_ID,
    token=HF_TOKEN
)

def create_asr_pipeline():
    """Create a new ASR pipeline instance for each process"""
    return pipeline(
        "automatic-speech-recognition",
        model=MODEL_ID,
        token=HF_TOKEN
    )

def transcribe_audio(file_like, return_timestamps=True):
    try:
        if hasattr(file_like, 'read'):
            import tempfile
            tmp_file = tempfile.NamedTemporaryFile(suffix='.wav', delete=False)
            try:
                file_like.seek(0)
                tmp_file.write(file_like.read())
                tmp_file.close()  
        
                audio_data, sample_rate = librosa.load(tmp_file.name, sr=16000)
            finally:
                try:
                    os.unlink(tmp_file.name)
                except:
                    pass
        elif isinstance(file_like, bytes):
            import tempfile
            tmp_file = tempfile.NamedTemporaryFile(suffix='.wav', delete=False)
            try:
                tmp_file.write(file_like)
                tmp_file.close() 
                
                audio_data, sample_rate = librosa.load(tmp_file.name, sr=16000)
            finally:
                try:
                    os.unlink(tmp_file.name)
                except:
                    pass
        else:
            audio_data, sample_rate = librosa.load(file_like, sr=16000)

        result = asr_pipeline(
            audio_data,
            return_timestamps=return_timestamps
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

def split_audio(audio_data, sample_rate, segment_length=30):
    """Split audio into segments for parallel processing"""
    segment_samples = int(segment_length * sample_rate)
    segments = []
    
    for i in range(0, len(audio_data), segment_samples):
        segment = audio_data[i:i + segment_samples]
        if len(segment) > 0:  # Only add non-empty segments
            segments.append({
                'audio': segment,
                'start_time': i / sample_rate,
                'end_time': (i + len(segment)) / sample_rate,
                'segment_index': len(segments)
            })
    
    return segments

def transcribe_segment(segment_data):
    """Transcribe a single audio segment"""
    try:
        # Create a new pipeline instance for this process
        pipeline_instance = create_asr_pipeline()
        
        result = pipeline_instance(
            segment_data['audio'],
            return_timestamps=True
        )
        
        # Extract text from result
        if isinstance(result, dict):
            text = result.get("text", "")
        elif isinstance(result, list) and len(result) > 0:
            if isinstance(result[0], dict):
                text = result[0].get("text", "")
            else:
                text = str(result[0])
        else:
            text = str(result)
        
        return {
            'segment_index': segment_data['segment_index'],
            'start_time': segment_data['start_time'],
            'end_time': segment_data['end_time'],
            'text': text,
            'success': True
        }
        
    except Exception as e:
        print(f"Error transcribing segment {segment_data['segment_index']}: {e}")
        return {
            'segment_index': segment_data['segment_index'],
            'start_time': segment_data['start_time'],
            'end_time': segment_data['end_time'],
            'text': "",
            'success': False,
            'error': str(e)
        }

def merge_segment_results(results):
    """Merge transcription results from multiple segments"""
    # Sort by segment index to maintain order
    sorted_results = sorted(results, key=lambda x: x['segment_index'])
    
    # Filter successful results
    successful_results = [r for r in sorted_results if r['success']]
    
    if not successful_results:
        return None
    
    # Combine text
    full_text = " ".join([r['text'] for r in successful_results])
    
    return {
        'text': full_text,
        'segments_processed': len(successful_results),
        'total_segments': len(results),
        'failed_segments': len(results) - len(successful_results)
    }

def transcribe_audio_parallel(file_like, num_processes=6, segment_length=15, return_timestamps=True):
    """Transcribe audio using parallel processing"""
    try:
        # Load audio data (same as original function)
        if hasattr(file_like, 'read'):
            tmp_file = tempfile.NamedTemporaryFile(suffix='.wav', delete=False)
            try:
                file_like.seek(0)
                tmp_file.write(file_like.read())
                tmp_file.close()  
                audio_data, sample_rate = librosa.load(tmp_file.name, sr=16000)
            finally:
                try:
                    os.unlink(tmp_file.name)
                except:
                    pass
        elif isinstance(file_like, bytes):
            tmp_file = tempfile.NamedTemporaryFile(suffix='.wav', delete=False)
            try:
                tmp_file.write(file_like)
                tmp_file.close() 
                audio_data, sample_rate = librosa.load(tmp_file.name, sr=16000)
            finally:
                try:
                    os.unlink(tmp_file.name)
                except:
                    pass
        else:
            audio_data, sample_rate = librosa.load(file_like, sr=16000)

        # Check if audio is too short for parallel processing
        audio_duration = len(audio_data) / sample_rate
        if audio_duration <= segment_length:
            print(f"Audio duration ({audio_duration:.2f}s) <= segment length ({segment_length}s), using sequential processing")
            return transcribe_audio(file_like, return_timestamps)

        # Split audio into segments
        segments = split_audio(audio_data, sample_rate, segment_length)
        print(f"Split audio into {len(segments)} segments for parallel processing")

        # Process segments in parallel
        start_time = time.time()
        with ProcessPoolExecutor(max_workers=num_processes) as executor:
            results = list(executor.map(transcribe_segment, segments))
        
        processing_time = time.time() - start_time
        print(f"Parallel processing completed in {processing_time:.2f} seconds")

        # Merge results
        merged_result = merge_segment_results(results)
        
        if merged_result and merged_result['text']:
            print(f"Successfully processed {merged_result['segments_processed']}/{merged_result['total_segments']} segments")
            if merged_result['failed_segments'] > 0:
                print(f"Warning: {merged_result['failed_segments']} segments failed")
            return merged_result['text']
        else:
            print("All segments failed, falling back to sequential processing")
            return transcribe_audio(file_like, return_timestamps)
            
    except Exception as e:
        print(f"Error in parallel transcription: {e}")
        print("Falling back to sequential processing")
        return transcribe_audio(file_like, return_timestamps)

def get_model_info():
    return {
        "model_id": MODEL_ID,
        "model_type": "whisper",
        "pipeline_type": "automatic-speech-recognition"
    }
