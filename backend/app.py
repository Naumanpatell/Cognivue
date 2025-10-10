import os
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import requests
from models.asr_model import transcribe_audio
from utils.supabase_clients import supabase

app = Flask(
    __name__,
    static_folder=os.path.join(os.path.dirname(__file__), '../frontend/build'),
    static_url_path='/'
)
CORS(app)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    file_path = os.path.join(app.static_folder, path)
    if path and os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/transcribe', methods=['POST', 'OPTIONS'])
def transcribe():
    if request.method == 'OPTIONS':
        # Handle CORS preflight request
        return '', 200
    
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    
    audio_file = request.files['audio']
    if audio_file.filename == '':
        return jsonify({'error': 'No audio file selected'}), 400
    
    # Validate file type
    allowed_extensions = {'wav', 'mp3', 'mpeg', 'm4a', 'webm'}
    if '.' not in audio_file.filename or audio_file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return jsonify({'error': 'Invalid file type. Please upload WAV, MP3, M4A, or WebM files.'}), 400
    
    try:
        transcribed_text = transcribe_audio(audio_file)
        if not transcribed_text:
            return jsonify({'error': 'Transcription failed - no text was generated'}), 400 
        return jsonify({'transcription': transcribed_text})
    except Exception as e:
        print(f"Transcription error: {str(e)}")
        return jsonify({'error': f'Transcription error: {str(e)}'}), 500

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
        
        # Download the file from Supabase storage as bytes
        response = supabase.storage.from_(bucket_name).download(file_name)
        
        # Pass bytes directly to your existing transcribe_audio function
        result = transcribe_audio(response)
        
        if not result:
            return jsonify({"error": "Transcription failed"}), 500
        
        return jsonify({"transcription": result})
        
    except Exception as e:
        print(f"Processing error: {str(e)}")
        return jsonify({"error": f"Processing error: {str(e)}"}), 500

# added supabase and just testing the table
#made the videos table and currently showing empty data row so its connected
@app.route("/test_supabase")
def test_supabase():
    if not supabase:
        return jsonify({"error": "Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY."}), 503
    try:
        response = supabase.table("videos_test").select("*").execute()
        return {"data": response.data}
    except Exception as e:
        return jsonify({"error": f"Supabase error: {str(e)}"}), 500

if __name__ == '__main__':
    print(f"Serving React from: {app.static_folder}")
    app.run(debug=True, host='0.0.0.0', port=5001)
