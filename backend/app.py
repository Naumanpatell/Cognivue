import os
from flask import Flask, send_from_directory
from flask_cors import CORS
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

# added supabase and just testing the table
#made the videos table and currently showing empty data row so its connected
@app.route("/test_supabase")
def test_supabase():
    response = supabase.table("videos_test").select("*").execute()
    return {"data": response.data}


if __name__ == '__main__':
    print(f"🚀 Serving React from: {app.static_folder}")
    app.run(debug=True)
