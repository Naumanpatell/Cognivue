import os
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

def test_supabase_connection():
    """Test Supabase connection and basic operations"""
    print("=== TESTING SUPABASE CONNECTION ===")
    
    try:
        from utils.supabase_clients import supabase
        
        if not supabase:
            print("❌ Supabase client not configured")
            print("Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables")
            return False
        
        print("✅ Supabase client created successfully")
        
        # Test basic table access
        try:
            response = supabase.table("videos_test").select("*").execute()
            print(f"✅ Table access successful: {len(response.data)} rows")
            return True
        except Exception as e:
            print(f"❌ Table access failed: {e}")
            return False
            
    except Exception as e:
        print(f"❌ Supabase connection failed: {e}")
        return False

def test_supabase_storage():
    """Test Supabase storage operations"""
    print("\n=== TESTING SUPABASE STORAGE ===")
    
    try:
        from utils.supabase_clients import supabase
        
        if not supabase:
            print("❌ Supabase not configured")
            return False
        
        # Test storage bucket access
        try:
            buckets = supabase.storage.list_buckets()
            print(f"✅ Storage buckets accessible: {len(buckets)} buckets")
            
            # Check for user_videos bucket
            bucket_names = [bucket['name'] for bucket in buckets]
            if 'user_videos' in bucket_names:
                print("✅ user_videos bucket found")
            else:
                print("⚠️ user_videos bucket not found")
            
            return True
            
        except Exception as e:
            print(f"❌ Storage access failed: {e}")
            return False
            
    except Exception as e:
        print(f"❌ Storage test failed: {e}")
        return False

def test_supabase_file_download():
    """Test downloading a file from Supabase storage"""
    print("\n=== TESTING SUPABASE FILE DOWNLOAD ===")
    
    try:
        from utils.supabase_clients import supabase
        
        if not supabase:
            print("❌ Supabase not configured")
            return False
        
        # Test file download (replace with actual filename)
        test_filename = "test.mp3"  # Change this to an actual file in your bucket
        
        try:
            response = supabase.storage.from_('user_videos').download(test_filename)
            print(f"✅ File download successful: {len(response)} bytes")
            return True
        except Exception as e:
            print(f"❌ File download failed: {e}")
            print("Make sure the file exists in the user_videos bucket")
            return False
            
    except Exception as e:
        print(f"❌ Download test failed: {e}")
        return False

def test_supabase_transcription():
    """Test transcription using Supabase file"""
    print("\n=== TESTING SUPABASE TRANSCRIPTION ===")
    
    try:
        from utils.supabase_clients import supabase
        from models.asr_model import transcribe_audio
        
        if not supabase:
            print("❌ Supabase not configured")
            return False
        
        # Test with a known file (replace with actual filename)
        test_filename = "test.mp3"  # Change this to an actual file in your bucket
        
        try:
            # Download file
            response = supabase.storage.from_('user_videos').download(test_filename)
            
            # Transcribe
            result = transcribe_audio(response)
            
            if result:
                print("✅ Supabase transcription successful!")
                print(f"Result length: {len(result)} characters")
                print(f"Preview: {result[:100]}...")
                return True
            else:
                print("❌ Transcription returned empty result")
                return False
                
        except Exception as e:
            print(f"❌ Supabase transcription failed: {e}")
            return False
            
    except Exception as e:
        print(f"❌ Transcription test failed: {e}")
        return False

def main():
    print("SUPABASE TESTING SUITE")
    print("=" * 50)
    
    tests_passed = 0
    total_tests = 4
    
    if test_supabase_connection():
        tests_passed += 1
    
    if test_supabase_storage():
        tests_passed += 1
    
    if test_supabase_file_download():
        tests_passed += 1
    
    if test_supabase_transcription():
        tests_passed += 1
    
    print(f"\n=== SUMMARY ===")
    print(f"Tests passed: {tests_passed}/{total_tests}")
    
    if tests_passed == total_tests:
        print("✅ All Supabase tests passed!")
    else:
        print("❌ Some Supabase tests failed.")
        print("\nTROUBLESHOOTING:")
        print("1. Set environment variables: SUPABASE_URL and SUPABASE_ANON_KEY")
        print("2. Ensure your Supabase project is active")
        print("3. Check that the user_videos bucket exists")
        print("4. Verify you have a test file in the bucket")

if __name__ == "__main__":
    main()
