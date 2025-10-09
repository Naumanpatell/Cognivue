import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from 'react-dropzone';
import { supabase } from '../lib/supabase';
import ProfileDropdown from '../components/ProfileDropdown';
import '../styles/MainPageStyle.css'

function MainPage() {
  const navigate = useNavigate()

  const [processing, setProcessing] = useState(false)
const [processingStatus, setProcessingStatus] = useState('')
const [transcriptionResult, setTranscriptionResult] = useState('')
const [uploadedFileName, setUploadedFileName] = useState('')


  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [uploadedFileUrl, setUploadedFileUrl] = useState('')

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/*': [],
      'audio/*': []
    },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        await handleFileUpload(acceptedFiles[0])
      }
    },
    multiple: false,
    disabled: uploading
  })

  const handleUpload = async (file) => {
    if (!file) {
      console.error('No file provided');
      return null;
    }

    // Check if user is authenticated
    // might get rid of this for testing/ not being too difficult to new users
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
      //console.log('File uploaded successfully:', publicUrl);
      return { url: publicUrl, fileName: fileName };
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
      return null;
    }
  }

  const handleFileUpload = async (file) => {
    if (!file) return
    
    setUploading(true)
    setUploadStatus('Uploading file...')
    setUploadedFileUrl('')

    try {
      const result = await handleUpload(file)
      if (result) {
        setUploadStatus('File uploaded successfully!')
        setUploadedFileUrl(result.url)
        setUploadedFileName(result.fileName) // Store the filename for processing
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
  const handleProcessFile = async () => {
    if (!uploadedFileName) {
      alert('No file uploaded to process')
      return
    }
  
    setProcessing(true)
    setProcessingStatus('Processing audio file...')
    setTranscriptionResult('')
  
    try {
      const response = await fetch('http://localhost:5001/process_supabase_file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bucketName: 'user_videos',
          fileName: uploadedFileName
        })
      })
  
      const data = await response.json()
      
      if (response.ok) {
        setProcessingStatus('Processing completed!')
        setTranscriptionResult(data.transcription)
      } else {
        setProcessingStatus(`Processing failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Processing error:', error)
      setProcessingStatus(`Processing failed: ${error.message}`)
    } finally {
      setProcessing(false)
    }
  }
  
  


    return (
      <div className="main-container">
        <header className="main-header">
            <div className="header-content">
              <div className="header-title" onClick={() => navigate('/')}>
                Cognivue
              </div>
            </div>
          <div className="header-controls">
            <ProfileDropdown />
          </div>
        </header>
        
        <main className="main-content">
          {/* Upload Section */}
          <section className="upload-section">
            <h2>Upload Audio/Video</h2>
            <div 
              {...getRootProps()} 
              className={`upload-area ${isDragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
            >
              <input {...getInputProps()} />
              {uploading ? (
                <p>Uploading...</p>
              ) : isDragActive ? (
                <p>Drop your file here!</p>
              ) : (
                <p>Drag and drop files here or click to browse</p>
              )}
            </div>
            {uploadStatus && (
              <div className="upload-status">
                <p className={uploadedFileUrl ? 'success' : 'error'}>{uploadStatus}</p>
                {uploadedFileUrl && (
                  <div>
                    <p>I'm gonna get rid of this, its only for testing</p>
                    <p>File URL:</p>
                    <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer">
                      {uploadedFileUrl}
                    </a>
                  </div>
                )}
              </div>
            )}
          </section>
          {/* Processing Section */}
<section className="processing-section">
  <h2>Processing</h2>
  <div className="processing-area">
    {uploadedFileUrl ? (
      <div>
        <p>File ready for processing!</p>
        <button 
          className="cta-button"
          onClick={handleProcessFile}
          disabled={processing}
          style={{ marginTop: '1rem' }}
        >
          {processing ? 'Processing...' : 'Process Audio'}
        </button>
        {processingStatus && (
          <div className="processing-status" style={{ marginTop: '1rem' }}>
            <p className={transcriptionResult ? 'success' : 'error'}>
              {processingStatus}
            </p>
          </div>
        )}
      </div>
    ) : (
      <p>Upload a file first to begin processing</p>
    )}
  </div>
</section>

{/* Results Section */}
<section className="results-section">
  <h2>Results</h2>
  <div className="results-area">
    {transcriptionResult ? (
      <div>
        <h3>Transcription:</h3>
        <div 
          style={{
            background: 'var(--light-gray)',
            padding: '1rem',
            borderRadius: '8px',
            marginTop: '1rem',
            textAlign: 'left',
            maxHeight: '400px',
            overflowY: 'auto'
          }}
        >
          {transcriptionResult}
        </div>
      </div>
    ) : (
      <p>Transcription results will appear here after processing...</p>
    )}
  </div>
</section>
        </main>
      </div>
    );
  }
  
  export default MainPage;
