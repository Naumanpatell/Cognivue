import os
import sys
import requests
import numpy as np
import soundfile as sf
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

def create_test_audio():
    """Create a simple test audio file"""
    sample_rate = 16000
    duration = 5.0
    # Create a simple sine wave
    t = np.linspace(0, duration, int(sample_rate * duration))
    audio = np.sin(2 * np.pi * 440 * t) * 0.5  # 440 Hz tone
    
    test_file = "test_audio/simple_test.wav"
    sf.write(test_file, audio, sample_rate)
    return test_file

def test_transcription():
    """Test basic transcription functionality"""
    print("Testing transcription...")
    
    # Create test audio
    test_file = create_test_audio()
    print(f"Created test audio: {test_file}")
    
    try:
        # Test transcription
        with open(test_file, 'rb') as f:
            files = {'audio': ('simple_test.wav', f, 'audio/wav')}
            response = requests.post('http://127.0.0.1:5001/transcribe', files=files, timeout=30)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            transcription = data.get('transcription', '')
            print(f"Transcription successful!")
            print(f"Result: {transcription}")
            return True
        else:
            print(f"Transcription failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"Error: {e}")
        return False
    finally:
        # Clean up
        try:
            os.remove(test_file)
        except:
            pass

if __name__ == "__main__":
    print("Simple Transcription Test")
    print("=" * 30)
    
    # Check if backend is running
    try:
        response = requests.get('http://127.0.0.1:5001/', timeout=5)
        print("Backend is running")
    except:
        print("Backend not running. Please start with: python app.py")
        exit(1)
    
    # Run test
    if test_transcription():
        print("Transcription test PASSED")
    else:
        print("Transcription test FAILED")
