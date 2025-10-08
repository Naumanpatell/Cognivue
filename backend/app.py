import os
from flask import Flask, send_from_directory
from flask_cors import CORS

# ✅ Proper Flask setup
app = Flask(
    __name__,
    static_folder=os.path.join(os.path.dirname(__file__), '../frontend/build'),
    static_url_path='/'
)

# ✅ Enable CORS for API calls
CORS(app)

# ✅ Route to serve React files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    file_path = os.path.join(app.static_folder, path)

    # Serve actual files if they exist (JS, CSS, images, etc.)
    if path and os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)

    # Serve index.html for React Router and root route
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    print(f"🚀 Serving React from: {app.static_folder}")
    app.run(debug=True)
