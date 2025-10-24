import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from 'react-dropzone';
import { supabase } from '../lib/supabase';
import ProfileDropdown from '../components/ProfileDropdown';
import '../styles/MainPageStyle.css'

function MainPage() {
  const navigate = useNavigate()

  const [selectedResult, setSelectedResult] = useState('empty')
  const [selectedInputMethod, setSelectedInputMethod] = useState('upload')

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
    setSummarisationResult('')
    setTranscriptionResult('')
    setSelectedResult('empty')

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

  const handleSummarizeText = async () => {
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

        <div className="input-method-controller">
          <button onClick={() => setSelectedInputMethod('upload')} className={selectedInputMethod === 'upload' ? 'active' : ''}>Upload</button>
          <button onClick={() => setSelectedInputMethod('text')} className={selectedInputMethod === 'text' ? 'active' : ''}>Text</button>
        </div>
        
        { selectedInputMethod === 'upload' && (
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
            <button className="cta-button" onClick={() => setSelectedResult('empty')}>RESET</button>
            <h2>Results</h2>
            
            <div className="results-controls">
              <button 
                className={selectedResult === 'transcription' ? 'active' : ''}
                onClick={() => setSelectedResult('transcription')}
              >
                Transcription
              </button>
              <button 
                className={selectedResult === 'summary' ? 'active' : ''}
                onClick={() => setSelectedResult('summary')}
              >
                Summary
              </button>
              <button 
                className={selectedResult === 'sentiment' ? 'active' : ''}
                onClick={() => setSelectedResult('sentiment')}
              >
                Sentiment
              </button>
              <button 
                className={selectedResult === 'objectDetection' ? 'active' : ''}
                onClick={() => setSelectedResult('objectDetection')}
              >
                Object Detection
              </button>
            </div>
            
            <div className="result-content">
              {selectedResult === 'transcription' && (
                <div className="result-display">
                  <h3>Transcription</h3>
                  {transcriptionResult ? (
                    <div className="result-text">{transcriptionResult}</div>
                  ) : (
                    <div className="result-placeholder">
                      <p>No transcription available. Process an audio file first.</p>
                    </div>
                  )}
                </div>
              )}
              
              {selectedResult === 'summary' && (
                <div className="result-display">
                  <h3>Summary</h3>
                  {summarisationResult ? (
                    <div className="result-text">{summarisationResult}</div>
                  ) : (
                    <div className="result-placeholder">
                      <p>No summary available yet.</p>
                      {transcriptionResult && (
                        <button onClick={handleSummarizeFile} className="cta-button">
                          Generate Summary
                        </button>
                      )}
                      {!transcriptionResult && (
                        <p className="help-text">Process an audio file first to generate a summary.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {selectedResult === 'sentiment' && (
                <div className="result-display">
                  <h3>Sentiment Analysis</h3>
                  <div className="result-placeholder">
                    <p>Sentiment analysis feature coming soon...</p>
                  </div>
                </div>
              )}
              
              {selectedResult === 'objectDetection' && (
                <div className="result-display">
                  <h3>Object Detection</h3>
                  <div className="result-placeholder">
                    <p>Object detection feature coming soon...</p>
                  </div>
                </div>
              )}
              
              {selectedResult === 'empty' && (
                <div className="result-placeholder">
                  <p>Select a result type above to view your processed data.</p>
                </div>
              )}
            </div>
          </section>
          </main>
        )}


        { selectedInputMethod === 'text' && (
          <main className="main-content">
          
          {/* Upload Section */}
          <section className="upload-section">
            <h2>Upload Text</h2>
            <div className="upload-content">
              <textarea placeholder="Enter your text here..." value={transcriptionResult} onChange={(e) => setTranscriptionResult(e.target.value)} className="text-input"/>
             
            </div>
          </section>

          {/* Processing Button Only for text */}
          <div className="processing-button-container">
            <button 
              className="cta-button"
              onClick={handleSummarizeText}
              disabled={processing}
            >
              {processing ? 'Summarizing...' : 'Summarize Text'}
            </button>
          </div>
          

          {/* Results Section */}
          <section className="results-section">
            <button className="cta-button" onClick={() => setSelectedResult('empty')}>RESET</button>
            <h2>Results</h2>
            
            <div className="results-controls">
              <button 
                className={selectedResult === 'summary' ? 'active' : ''}
                onClick={() => setSelectedResult('summary')}
              >
                Summary
              </button>
              <button 
                className={selectedResult === 'sentiment' ? 'active' : ''}
                onClick={() => setSelectedResult('sentiment')}
              >
                Sentiment
              </button>
            </div>
            
            <div className="result-content">
              {selectedResult === 'summary' && (
                <div className="result-display">
                  <h3>Summary</h3>
                  {summarisationResult ? (
                    <div className="result-text">{summarisationResult}</div>
                  ) : (
                    <div className="result-placeholder">
                      <p>No summary available yet.</p>
                      {transcriptionResult && (
                        <p className="help-text">Waiting for summary to be generated...</p>
                      )}
                      {!transcriptionResult && (
                        <p className="help-text">Enter text to generate a summary.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {selectedResult === 'sentiment' && (
                <div className="result-display">
                  <h3>Sentiment Analysis</h3>
                  <div className="result-placeholder">
                    <p>Sentiment analysis feature coming soon...</p>
                  </div>
                </div>
              )}
              
              {selectedResult === 'objectDetection' && (
                <div className="result-display">
                  <h3>Object Detection</h3>
                  <div className="result-placeholder">
                    <p>Object detection feature coming soon...</p>
                  </div>
                </div>
              )}
              
              {selectedResult === 'empty' && (
                <div className="result-placeholder">
                  <p>Select a result type above to view your processed data.</p>
                </div>
              )}
            </div>
          </section>
          </main>
        )}
        
      </div>
    );
  }
  
  export default MainPage;

