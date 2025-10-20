import os
import sys
from pathlib import Path

# Add backend to path for imports
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv
load_dotenv()

def test_audio_transcription():
    """Test transcription with audio files from Sample_inputs/test_audio"""
    print("=== AUDIO TRANSCRIPTION TEST ===")
    
    try:
        from models.asr_model import transcribe_audio
    except ImportError as e:
        print(f"Failed to import transcribe_audio: {e}")
        return False
    
    # Path to sample audio files
    audio_dir = backend_dir / "Sample_inputs" / "test_audio"
    
    if not audio_dir.exists():
        print(f"Audio directory not found: {audio_dir}")
        return False
    
    # Find audio files
    audio_files = []
    for ext in ['*.wav', '*.mp3', '*.m4a', '*.webm']:
        audio_files.extend(audio_dir.glob(ext))
    
    if not audio_files:
        print("No audio files found in sample inputs")
        return False
    
    print(f"Found {len(audio_files)} audio files:")
    for file in audio_files:
        print(f"  - {file.name}")
    
    print("\n" + "="*80)
    
    # Test each audio file
    for audio_file in audio_files:
        print(f"\nPROCESSING: {audio_file.name}")
        print("-" * 50)
        
        try:
            with open(audio_file, 'rb') as f:
                transcription = transcribe_audio(f)
            
            if transcription:
                print("TRANSCRIPTION SUCCESS!")
                print(f"Length: {len(transcription)} characters")
                print(f"Text: {transcription}")
            else:
                print("TRANSCRIPTION FAILED - No text returned")
                
        except Exception as e:
            print(f"TRANSCRIPTION ERROR: {e}")
            import traceback
            traceback.print_exc()
        
        print("="*80)
    
    return True

def main():
    print("AUDIO TRANSCRIPTION TESTING")
    print("=" * 50)
    
    # Check environment
    hf_token = os.getenv("HF_TOKEN")
    if hf_token:
        print(f"✓ HF_TOKEN is set (length: {len(hf_token)})")
    else:
        print("⚠ HF_TOKEN not set - this may cause issues")
    
    print()
    
    # Run transcription test
    success = test_audio_transcription()
    
    if success:
        print("\n✓ Transcription test completed")
    else:
        print("\n✗ Transcription test failed")
        print("\nTROUBLESHOOTING:")
        print("1. Ensure HF_TOKEN is set in .env file")
        print("2. Check that audio files exist in backend/Sample_inputs/test_audio/")
        print("3. Verify all dependencies are installed: pip install -r requirements.txt")

if __name__ == "__main__":
    main()
