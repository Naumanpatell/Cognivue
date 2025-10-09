import React, { useState } from "react";
import { supabase } from '../lib/supabase';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/MainPageStyle.css'

function MainPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [uploadedFileUrl, setUploadedFileUrl] = useState('')

  const handleUpload = async (file) => {
    if (!file) {
      console.error('No file provided');
      return null;
    }

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error('User not authenticated');
      alert('Please log in to upload files');
      return null;
    }

    const fileName = `${Date.now()}-${file.name}`;

    try {
      const {data, error} = await supabase.storage.from('user_videos').upload(fileName, file)

      if (error) {
        console.error('Error uploading file:', error);
        alert(`Upload failed: ${error.message}`);
        return null;
      }

      const {data: {publicUrl}} = supabase.storage.from('user_videos').getPublicUrl(fileName);
      console.log('File uploaded successfully:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
      return null;
    }
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setUploading(true)
    setUploadStatus('Uploading file...')
    setUploadedFileUrl('')
    
    try {
      const url = await handleUpload(file)
      if (url) {
        setUploadStatus('File uploaded successfully!')
        setUploadedFileUrl(url)
        console.log('Uploaded! URL:', url)
      } else {
        setUploadStatus('Upload failed')
      }
    } catch (error) {
      console.error('Failed:', error)
      setUploadStatus(`Upload failed: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }
  


    return (
      <div className="main-container">
        <header className="main-header">
          <div className="header-content">
            <h1>Cognivue</h1>
          </div>
          <div className="header-controls">
            <ThemeToggle />
          </div>
        </header>
        
        <main className="main-content">
          {/* Upload Section */}
          <section className="upload-section">
            <h2>Upload Audio/Video</h2>
            <div className="upload-area">
              <p>Drag and drop files here or click to browse</p>
            </div>
            <div className="upload-form">
            <input 
              type="file" 
              accept="video/*,audio/*"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            {uploadStatus && (
              <div className="upload-status">
                <p className={uploadedFileUrl ? 'success' : 'error'}>{uploadStatus}</p>
                {uploadedFileUrl && (
                  <div>
                    <p>File URL:</p>
                    <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer">
                      {uploadedFileUrl}
                    </a>
                  </div>
                )}
              </div>
            )}
            </div>
          </section>
          
          {/* Processing Section */}
          <section className="processing-section">
            <h2>Processing</h2>
            <div className="processing-area">
              <p>Processing will appear here...</p>
            </div>
          </section>

          {/* Results Section */}
          <section className="results-section">
            <h2>Results</h2>
            <div className="results-area">
              <p>Transcription and analysis results will appear here...</p>
            </div>
          </section>
        </main>
      </div>
    );
  }
  
  export default MainPage;
