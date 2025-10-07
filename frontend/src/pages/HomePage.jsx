import React from "react";
import '../styles/HomeStyle.css'


// This is just the landing page, if u guys want to make it so this is the actual page
// with all the features i can just remove it



function HomePage() {
    return (
      <div className="home-container">
        <header className="home-header">
          <h1>InsightXR</h1>
          <p className="tagline">AI-Powered Video Analysis Platform</p>
        </header>
        <main className="home-main">
            // the hero needs to be improved, but debating animating
          <section className="hero-section">
            <h2>Extract Insights from Your Videos</h2>
            <p>Upload a video and get automatic transcription, summaries, sentiment analysis, and more</p>
            <button className="cta-button" onClick={() => {console.log("Started button pressed")}}>Get Started</button>
          </section>


           {/* Features listed under here */}
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
