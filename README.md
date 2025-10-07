# InsightXR — Multimodal Video Intelligence System

## Overview
InsightXR is a full-stack AI-powered web platform that converts videos into structured insights using speech recognition, computer vision, and natural language processing (NLP).  
The system allows users to upload videos, processes them through multiple AI pipelines, and displays results through an interactive dashboard.  
It demonstrates skills in AI model integration, full-stack development, and scalable web architecture.

---

## Project Structure

insightxr/
│
├── backend/ # Flask backend (AI + API)
│ ├── app.py
│ ├── requirements.txt
│ ├── models/
│ │ ├── asr_model.py
│ │ ├── vision_model.py
│ │ └── nlp_model.py
│ ├── utils/
│ │ ├── audio_utils.py
│ │ ├── video_utils.py
│ │ └── text_utils.py
│ ├── routes/
│ │ ├── upload_routes.py
│ │ ├── process_routes.py
│ │ └── results_routes.py
│ └── instance/
│
└── frontend/ # React frontend
├── package.json
├── public/
│ └── index.html
└── src/
├── App.js
├── index.js
├── components/
│ ├── UploadForm.jsx
│ ├── Dashboard.jsx
│ ├── InsightCard.jsx
│ ├── Charts/
│ │ ├── SentimentChart.jsx
│ │ └── KeywordCloud.jsx
├── pages/
│ ├── Home.jsx
│ └── Results.jsx
├── styles/
│ ├── App.css
│ ├── Dashboard.css
│ └── UploadForm.css
└── services/
└── api.js

yaml
Copy code

---

## Features
- Upload and process video files  
- Automatic speech-to-text transcription using Whisper  
- Object and scene detection with Hugging Face vision models  
- Text summarization, topic extraction, and sentiment analysis  
- Interactive React dashboard with charts and keyword visualization  
- Modular and scalable Flask REST API  

---

## Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | React.js, Chart.js, Axios, CSS |
| Backend | Python, Flask, REST API |
| AI Models | Hugging Face Transformers, Whisper |
| Data Processing | OpenCV, Librosa, JSON |
| Storage | Local / AWS S3 / SQLite |
| Visualization | Chart.js, D3.js |

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/InsightXR.git
cd insightxr
2. Backend Setup (Flask)
bash
Copy code
cd backend
python -m venv venv
venv\Scripts\activate      # On Windows
# or
source venv/bin/activate   # On macOS/Linux

pip install -r requirements.txt
python app.py
The Flask backend will run on:

arduino
Copy code
http://localhost:5000
3. Frontend Setup (React)
bash
Copy code
cd frontend
npm install
npm start
The React frontend will run on:

arduino
Copy code
http://localhost:3000
4. Connect Frontend and Backend
In frontend/package.json, add the following line:

json
Copy code
{
  "proxy": "http://localhost:5000"
}
This ensures all API calls from React are forwarded to the Flask backend during development.

API Endpoints
Route	Method	Description
/upload	POST	Uploads a video file
/process	POST	Runs AI pipeline (ASR, Vision, NLP)
/results	GET	Fetches processed insights and analytics

Team Roles (Example)
Role	Member	Responsibilities
Frontend Developer	Member 1	React UI, UploadForm, Dashboard, Charts
Backend Developer	Member 2	Flask API, route management, data handling
AI Engineer	Member 3	Model integration (Whisper, Hugging Face), optimization
