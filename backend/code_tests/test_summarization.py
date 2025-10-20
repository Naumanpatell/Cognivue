import os
import sys
from pathlib import Path

# Add backend to path for imports
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv

# Load .env from multiple possible locations
load_dotenv()  


def test_text_summarization():
    """Test summarization with text files from Sample_inputs/test_text"""
    print("=== TEXT SUMMARIZATION TEST ===")
    
    try:
        from models.summarizer_model import summarize_text, get_available_summarizers
        print("✓ Successfully imported summarizer functions")
    except ImportError as e:
        print(f"Failed to import summarizer functions: {e}")
        return False
    
    # Test if summarizer can be initialized
    try:
        # Try to create a simple test summary to check if the model loads
        test_text = "This is a test sentence for summarization."
        print("Testing summarizer initialization...")
        test_summary = summarize_text(test_text, max_length=50, min_length=10)
        if test_summary:
            print("✓ Summarizer model loaded successfully")
        else:
            print("⚠ Summarizer model loaded but returned no result")
    except Exception as e:
        print(f"✗ Failed to initialize summarizer: {e}")
        print("This is likely due to missing HF_TOKEN or model download issues")
        return False
    
    # Path to sample text files
    text_dir = backend_dir / "Sample_inputs" / "test_text"
    
    if not text_dir.exists():
        print(f"Text directory not found: {text_dir}")
        return False
    
    # Find text files
    text_files = list(text_dir.glob("*.txt"))
    
    if not text_files:
        print("No text files found in sample inputs")
        print("Add .txt files to backend/Sample_inputs/test_text/")
        return False
    
    print(f"Found {len(text_files)} text files:")
    for file in text_files:
        print(f"  - {file.name}")
    
    # Show available summarizers
    available_models = get_available_summarizers()
    print(f"\nAvailable summarizer models: {', '.join(available_models)}")
    print("Currently using: facebook/bart-large-cnn")
    
    print("\n" + "="*80)
    
    # Test each text file
    for text_file in text_files:
        print(f"\nPROCESSING: {text_file.name}")
        print("-" * 50)
        
        try:
            # Read text content
            with open(text_file, 'r', encoding='utf-8', errors='ignore') as f:
                text_content = f.read().strip()
            
            if not text_content:
                print("SKIPPED - Empty file")
                continue
            
            print(f"INPUT TEXT ({len(text_content)} characters):")
            preview = text_content[:300] + "..." if len(text_content) > 300 else text_content
            print(preview)
            print()
            
            # Call summarize_text with required parameters
            try:
                summary = summarize_text(text_content, max_length=130, min_length=30)
            except Exception as e:
                print(f"SUMMARIZATION ERROR: {e}")
                continue
            
            if summary:
                print("SUMMARIZATION SUCCESS!")
                print(f"Summary length: {len(summary)} characters")
                print(f"SUMMARY: {summary}")
            else:
                print("SUMMARIZATION FAILED - No summary returned")
                
        except Exception as e:
            print(f"PROCESSING ERROR: {e}")
            import traceback
            traceback.print_exc()
        
        print("="*80)
    
    return True

def main():
    print("TEXT SUMMARIZATION TESTING")
    print("=" * 50)
    
    # Check environment
    hf_token = os.getenv("HF_TOKEN")
    if hf_token:
        print(f"✓ HF_TOKEN is set (length: {len(hf_token)})")
    else:
        print("⚠ HF_TOKEN not set - this may cause issues")
        print("   To set HF_TOKEN:")
        print("   1. Edit backend/.env file and replace 'your_huggingface_token_here' with your actual token")
        print("   2. Or set it in PowerShell: $env:HF_TOKEN='your_token'")
        print("   3. Or set it in CMD: set HF_TOKEN=your_token")
        
        # Debug: Check if .env file exists
        env_file = backend_dir / ".env"
        if env_file.exists():
            print(f"   Found .env file at: {env_file}")
            with open(env_file, 'r') as f:
                content = f.read()
                if "HF_TOKEN=" in content:
                    print("   .env file contains HF_TOKEN line")
                else:
                    print("   .env file does not contain HF_TOKEN line")
        else:
            print(f"   No .env file found at: {env_file}")
    
    print()
    
    # Run summarization test
    success = test_text_summarization()
    
    if success:
        print("\n✓ Summarization test completed")
    else:
        print("\n✗ Summarization test failed")
        print("\nTROUBLESHOOTING:")
        print("1. Set HF_TOKEN in .env file or environment variable")
        print("2. Add text files to backend/Sample_inputs/test_text/")
        print("3. Verify all dependencies are installed: pip install -r requirements.txt")
        print("4. Check that the summarizer model can be loaded")

if __name__ == "__main__":
    main()
