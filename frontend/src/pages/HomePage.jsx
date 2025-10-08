import React from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from '../components/ThemeToggle';
import '../styles/HomeStyle.css'

function HomePage() {
  const navigate = useNavigate();
  
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1>Cognivue</h1>
          <p className="tagline">AI-Powered Video Analysis Platform</p>
        </div>
        <div className="header-controls">
          <ThemeToggle />
        </div>
      </header>
      <main className="home-main">
        <section className="hero-section">
          <h2>Extract Insights from Your Videos</h2>
          <p>Upload a video and get automatic transcription, summaries, sentiment analysis, and more</p>
          <button className="cta-button" onClick={() => navigate('/auth')}>
            Get Started
          </button>
        </section>

        <section className="features-section">
          <div className="feature-card">
            <h3>🎤 Speech Recognition</h3>
            <p>Automatic transcription using advanced AI models</p>
          </div>
          <div className="feature-card">
            <h3>📊 Sentiment Analysis</h3>
            <p>Understand the emotional tone of your content</p>
          </div>
          <div className="feature-card">
            <h3>👁️ Object Detection</h3>
            <p>Identify people, objects, and actions in scenes</p>
          </div>
          <div className="feature-card">
            <h3>📝 Smart Summaries</h3>
            <p>Get concise summaries of long videos</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
