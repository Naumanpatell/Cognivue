import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from 'react-dropzone';
import { supabase } from '../lib/supabase';
import ProfileDropdown from '../components/ProfileDropdown';
import '../styles/MainPageStyle.css'

function MainPage() {
  const navigate = useNavigate()

  const [selectedResult, setSelectedResult] = useState('')

  const [processing, setProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState('')
  const [transcriptionResult, setTranscriptionResult] = useState('')
  const [summarisationResult, setSummarisationResult] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')

  const [renaming, setRenaming] = useState(false)

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


  const handleSummarizeFile = async () => {
    console.log('Summarizing transcription...')
    if (!transcriptionResult) {
      alert('No transcription available to summarize. Please process the audio file first.')
      return
    }
  
    setProcessing(true)
    setProcessingStatus('Summarizing transcription...')
    setSummarisationResult('')
  
    try {
      const response = await fetch('http://localhost:5001/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: transcriptionResult
        })
      })
  
      const data = await response.json()
      
      if (response.ok) {
        setProcessingStatus('Summarizing completed!')
        setSummarisationResult(data.summary)
      } else {
        setProcessingStatus(`Summarizing failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Summarizing error:', error)
      setProcessingStatus(`Summarizing failed: ${error.message}`)
    } finally {
      setProcessing(false)
    }
  }


  const renameFile = async () => {
    if (!uploadedFileName) {
      alert('No file uploaded to rename')
      return
    }

    setRenaming(true)

    const newFileName = prompt('Enter the new file name:')
    if (newFileName) {
      const newFileNameMp3 = newFileName + ".mp3"
      const {data, error} = await supabase.storage.from('user_videos').copy(uploadedFileName, newFileNameMp3)
      if (error) {
        alert('Error renaming file: ' + error.message)
        setRenaming(false)
        return
      }
      
      // Remove the old file
      const {error: deleteError} = await supabase.storage.from('user_videos').remove([uploadedFileName])
      if (deleteError) {
        console.error('Error deleting old file:', deleteError)
        alert('File renamed but old file could not be deleted: ' + deleteError.message)
      }
      
      // Get the public URL for the new file
      const {data: {publicUrl}} = supabase.storage.from('user_videos').getPublicUrl(newFileNameMp3)
      
      // Update state with new file information
      setUploadedFileName(newFileNameMp3)
      setUploadedFileUrl(publicUrl)
      
      alert('File renamed successfully')
      console.log("Original file deleted:", uploadedFileName)
      console.log("New file created:", newFileNameMp3)
      setRenaming(false)
    } else {
      setRenaming(false)
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
            <div className="upload-content">
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
                <div className="upload-status" {...{onClick: (e) => e.stopPropagation()}}>
                  <p className={uploadedFileUrl ? 'success' : 'error'}>{uploadStatus}</p>
                  {uploadedFileUrl && (
                    <div>
                      <p>File Name:</p>
                      <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer">
                        {uploadedFileName}
                      </a>
                      
                      
                    </div>
                  )}
                  <button onClick={(e) => {e.stopPropagation(); renameFile()}} disabled={renaming}>{renaming ? 'Renaming...' : 'Rename'}</button>
                </div> 
              )}
            </div>
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
            {processing ? (
              <div className="processing-loader">
                <div className="spinner"></div>
                <div className="processing-text">{processingStatus}</div>
                <div className="processing-dots">
                  <div className="processing-dot"></div>
                  <div className="processing-dot"></div>
                  <div className="processing-dot"></div>
                </div>
              </div>
            ) : (
              <p className={transcriptionResult ? 'success' : 'error'}>
                {processingStatus}
              </p>
            )}
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
  <div className="results-controls">
    <button onClick={() => setSelectedResult('transcription')}>Transcription</button>
    <button onClick={() => setSelectedResult('summary')}>Summary</button>
    <button onClick={() => setSelectedResult('sentiment')}>Sentiment</button>
    <button onClick={() => setSelectedResult('objectDetection')}>Object Detection</button>
  </div>
  <h3>{selectedResult === 'transcription' ? 'Transcription:' : selectedResult === 'summary' ? 'Summary:' : selectedResult === 'sentiment' ? 'Sentiment:' : 'Object Detection:'}</h3>
  
  {transcriptionResult === '' && (
    <p>No transcription results available</p>
  )}
  {transcriptionResult !== '' && (
    <button onClick={handleSummarizeFile}>Summarize</button>
  )}
  
  <div className="results-area">
    {selectedResult ? (
      <div>
        <div className="transcription-result">
        {selectedResult === 'transcription' ? transcriptionResult : ''}
        {selectedResult === 'summary' ? summarisationResult : ''}
        {selectedResult === 'sentiment' ? 'SENTIMENT TEXT HERE' : ''}
        {selectedResult === 'objectDetection' ? 'OBJECT DETECTION TEXT HERE' : ''}
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
