import os
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import requests
from models.asr_model import transcribe_audio

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

@app.route('/transcribe', methods=['POST'])
def transcribe():
    audio_path = requests.files['audio']
    transcriped_text = transcribe_audio(audio_path)
    if not audio_path or not transcriped_text:
        return jsonify({'error': 'Invalid audio file or transcription failed'}), 400
    return jsonify({'transcription': transcriped_text})

if __name__ == '__main__':
    print(f"Serving React from: {app.static_folder}")
    app.run(debug=True)
