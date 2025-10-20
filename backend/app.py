import time
from flask import Flask, jsonify, request
from flask_cors import CORS
from models.asr_model import transcribe_audio
from models.summarizer_model import summarize_text, get_available_summarizers
from utils.supabase_clients import supabase

app = Flask(__name__)
CORS(app)

def format_duration(seconds):
    minutes = int(seconds // 60)
    seconds = int(seconds % 60)
    return f"{minutes:02d}:{seconds:02d}"


@app.route('/transcribe', methods=['POST', 'OPTIONS'])
def transcribe():
    if request.method == 'OPTIONS':
        return '', 200

    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    audio_file = request.files['audio']

    if audio_file.filename == '':
        return jsonify({'error': 'No audio file selected'}), 400
    allowed_extensions = {'wav', 'mp3', 'mpeg', 'm4a', 'webm'}
    
    if '.' not in audio_file.filename or audio_file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return jsonify({'error': 'Invalid file type. Please upload WAV, MP3, M4A, or WebM files.'}), 400
    
    try:
        start_time = time.time()
        print(f"Starting transcription at {time.strftime('%H:%M:%S')}")
        
        transcribed_text = transcribe_audio(audio_file)
        
        end_time = time.time()
        duration = end_time - start_time
        duration_formatted = format_duration(duration)
        print(f"Transcription completed in {duration_formatted} (MM:SS)")
        
        if not transcribed_text:
            return jsonify({'error': 'Transcription failed - no text was generated'}), 400 
        
        return jsonify({
            'transcription': transcribed_text,
            'processing_time': duration_formatted,
            'processing_time_seconds': round(duration, 2)
        })
    except Exception as e:
        print(f"Transcription error: {str(e)}")
        return jsonify({'error': f'Transcription error: {str(e)}'}), 500


@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided for summarization'}), 400
    
    text = data['text']
    
    # Get optional parameters with defaults
    max_length = data.get('max_length', 130)
    min_length = data.get('min_length', 30)
    
    try:
        start_time = time.time()
        print(f"Starting summarization at {time.strftime('%H:%M:%S')}")
        
        summary = summarize_text(text, max_length, min_length)
        
        end_time = time.time()
        duration = end_time - start_time
        duration_formatted = format_duration(duration)
        print(f"Summarization completed in {duration_formatted} (MM:SS)")
        
        if not summary:
            return jsonify({'error': 'Summarization failed - no summary was generated'}), 400
        
        return jsonify({
            'summary': summary,
            'processing_time': duration_formatted,
            'processing_time_seconds': round(duration, 2),
            'original_length': len(text),
            'summary_length': len(summary)
        })
        
    except Exception as e:
        print(f"Summarization error: {str(e)}")
        return jsonify({'error': f'Summarization error: {str(e)}'}), 500


@app.route('/summarizers', methods=['GET'])
def get_summarizers():
    """Get available summarizer models"""
    try:
        models = get_available_summarizers()
        return jsonify({
            'available_models': models,
            'current_model': 'facebook/bart-large-cnn'
        })
    except Exception as e:
        return jsonify({'error': f'Failed to get summarizers: {str(e)}'}), 500


@app.route('/process_supabase_file', methods=['POST'])
def process_supabase_file():
    if not supabase:
        return jsonify({"error": "Supabase is not configured"}), 503

    try:
        data = request.get_json()
        bucket_name = data.get('bucketName')
        file_name = data.get('fileName')
        
        if not bucket_name or not file_name:
            return jsonify({"error": "Missing bucketName or fileName"}), 400
        
        # Start timer
        start_time = time.time()
        print(f"Starting Supabase transcription at {time.strftime('%H:%M:%S')}")
        
        response = supabase.storage.from_(bucket_name).download(file_name)
        result = transcribe_audio(response)
        
        # Stop timer and calculate duration
        end_time = time.time()
        duration = end_time - start_time
        duration_formatted = format_duration(duration)
        print(f"Supabase transcription completed in {duration_formatted} (MM:SS)")
        
        if not result:
            return jsonify({"error": "Transcription failed"}), 500
        
        return jsonify({
            "transcription": result,
            "processing_time": duration_formatted,
            "processing_time_seconds": round(duration, 2)
        })
        
    except Exception as e:
        print(f"Processing error: {str(e)}")
        return jsonify({"error": f"Processing error: {str(e)}"}), 500

if __name__ == '__main__':
    print("Starting transcription API server...")
    app.run(debug=True, host='0.0.0.0', port=5001)
