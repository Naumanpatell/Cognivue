import os
import sys
import requests
import numpy as np
import soundfile as sf
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

def test_imports():
    """Test if all required modules can be imported"""
    print("=== TESTING IMPORTS ===")
    
    try:
        import torch
        print(f"PyTorch: {torch.__version__}")
    except ImportError as e:
        print(f"PyTorch import failed: {e}")
        return False
    
    try:
        import transformers
        print(f"Transformers: {transformers.__version__}")
    except ImportError as e:
        print(f"Transformers import failed: {e}")
        return False
    
    try:
        import librosa
        print(f"Librosa: {librosa.__version__}")
    except ImportError as e:
        print(f"Librosa import failed: {e}")
        return False
    
    try:
        import soundfile
        print(f"SoundFile: {soundfile.__version__}")
    except ImportError as e:
        print(f"SoundFile import failed: {e}")
        return False
    
    return True

def test_environment():
    """Test environment variables and setup"""
    print("\n=== TESTING ENVIRONMENT ===")
    
    # Check HF token
    hf_token = os.getenv("HF_TOKEN")
    if hf_token:
        print(f" HF_TOKEN is set (length: {len(hf_token)})")
    else:
        print(" HF_TOKEN not set - this may cause issues")
    
    return True

def test_direct_transcription():
    """Test transcription directly without Flask"""
    print("\n=== TESTING DIRECT TRANSCRIPTION ===")
    
    try:
        from models.asr_model import transcribe_audio
        
        # Test with WAV file
        wav_file = "backend/test_audio/test.wav"
        
        if not os.path.exists(wav_file):
            print(f" WAV file not found: {wav_file}")
            return False
        
        print(f" Testing with: {wav_file}")
        
        with open(wav_file, 'rb') as f:
            result = transcribe_audio(f)
        
        if result:
            print(" Direct transcription SUCCESS!")
            print(f"Length: {len(result)} characters")
            print(f"Preview: {result[:100]}...")
            return True
        else:
            print(" Direct transcription returned empty/None")
            return False
            
    except Exception as e:
        print(f" Direct transcription failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_api_endpoint():
    """Test the Flask API endpoint"""
    print("\n=== TESTING API ENDPOINT ===")
    
    # Create a short test audio (5 seconds of silence)
    test_file = "backend/test_audio/short_test.wav"
    
    try:
        # Generate 5 seconds of silence
        sample_rate = 16000
        duration = 5.0
        silence = np.zeros(int(sample_rate * duration))
        
        # Save as WAV
        sf.write(test_file, silence, sample_rate)
        print(f" Created short test file: {test_file}")
        
        # Test API
        with open(test_file, 'rb') as f:
            files = {'audio': ('short_test.wav', f, 'audio/wav')}
            response = requests.post('http://127.0.0.1:5001/transcribe', files=files, timeout=30)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if 'transcription' in data:
                print(" API transcription SUCCESS!")
                print(f"Transcription: {data['transcription']}")
                return True
            else:
                print(" No transcription in response")
                print(f"Response: {response.text}")
                return False
        else:
            print(f" API request failed: {response.text}")
            return False
            
    except Exception as e:
        print(f" API test failed: {e}")
        return False

def test_mp3_conversion():
    """Test MP3 to WAV conversion"""
    print("\n=== TESTING MP3 CONVERSION ===")
    
    try:
        import librosa
        
        mp3_file = "backend/test_audio/LearningEnglishConversations-20250923-TheEnglishWeSpeakNoLegToStandOn.mp3"
        wav_file = "backend/test_audio/converted_test.wav"
        
        if not os.path.exists(mp3_file):
            print(f" MP3 file not found: {mp3_file}")
            return False
        
        print(f" Converting MP3 to WAV...")
        
        # Load MP3 with librosa (handles MP3 without FFmpeg)
        audio_data, sample_rate = librosa.load(mp3_file, sr=16000)
        
        # Save as WAV
        sf.write(wav_file, audio_data, sample_rate)
        
        print(f" Conversion successful: {wav_file}")
        print(f"Duration: {len(audio_data) / sample_rate:.2f} seconds")
        print(f"Sample rate: {sample_rate} Hz")
        
        return True
        
    except Exception as e:
        print(f" MP3 conversion failed: {e}")
        return False

def test_full_transcription_pipeline():
    """Test the complete transcription pipeline"""
    print("\n=== TESTING FULL PIPELINE ===")
    
    try:
        from models.asr_model import transcribe_audio
        
        # Test with the converted WAV file
        wav_file = "backend/test_audio/converted_test.wav"
        
        if not os.path.exists(wav_file):
            print(f" Converted WAV file not found: {wav_file}")
            return False
        
        print(f" Testing full pipeline with: {wav_file}")
        
        with open(wav_file, 'rb') as f:
            result = transcribe_audio(f)
        
        if result:
            print(" Full pipeline SUCCESS!")
            print(f"Length: {len(result)} characters")
            print(f"Preview: {result[:200]}...")
            return True
        else:
            print(" Full pipeline returned empty result")
            return False
            
    except Exception as e:
        print(f" Full pipeline failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("TRANSCRIPTION TESTING SUITE")
    print("=" * 50)
    
    tests_passed = 0
    total_tests = 6
    
    if test_imports():
        tests_passed += 1
    
    if test_environment():
        tests_passed += 1
    
    if test_direct_transcription():
        tests_passed += 1
    
    if test_api_endpoint():
        tests_passed += 1
    
    if test_mp3_conversion():
        tests_passed += 1
    
    if test_full_transcription_pipeline():
        tests_passed += 1
    
    print(f"\n=== SUMMARY ===")
    print(f"Tests passed: {tests_passed}/{total_tests}")
    
    if tests_passed == total_tests:
        print(" All transcription tests passed!")
        print(" Your transcription system is working perfectly!")
    else:
        print(" Some transcription tests failed.")
        print("\nTROUBLESHOOTING:")
        print("1. Ensure backend is running: python backend/app.py")
        print("2. Set HF_TOKEN if needed: $env:HF_TOKEN='your_token'")
        print("3. Check that test audio files exist")
        print("4. Verify all Python dependencies are installed")

if __name__ == "__main__":
    main()