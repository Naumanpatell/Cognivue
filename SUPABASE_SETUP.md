# Supabase Setup Guide

## Quick Setup Steps

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Note down your project URL and anon key from the project settings

### 2. Configure Environment Variables
Create a `.env` file in the `frontend` directory with your Supabase credentials:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install Dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt
```

### 4. Run the Application
```bash
# Terminal 1: Start Flask backend
cd backend
python app.py

# Terminal 2: Start React frontend (for development)
cd frontend
npm start
```

## What's Fixed

✅ **Authentication Logic**: Fixed error handling in AuthPage.jsx
✅ **CORS Support**: Added Flask-CORS for API calls
✅ **Environment Configuration**: Added proper Supabase configuration
✅ **Error Messages**: Improved user feedback for auth operations

## Troubleshooting

- Make sure your Supabase project is active
- Check that your environment variables are correctly set
- Ensure both Flask and React servers are running
- Check browser console for any Supabase configuration warnings
