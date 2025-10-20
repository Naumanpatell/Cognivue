import React from "react";
import { supabase } from '../lib/supabase';
import { useNavigate } from "react-router-dom";
import ThemeToggle from '../components/ThemeToggle';
import '../styles/HomeStyle.css'

function HomePage() {
  const navigate = useNavigate();

  async function handleNavigation() {
    const {data: {session}} = await supabase.auth.getSession();
    if (session) {
      navigate('/main');
    } else {
      navigate('/auth');
    }
  }

  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('.features-section');
    featuresSection.scrollIntoView({ behavior: 'smooth' });
  };
  
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
          <button className="cta-button" onClick={handleNavigation}>
            Get Started
          </button>
        </section>

        {/* I've added this to scroll for now  :D maybe we keep? perchance*/}

        <div className="scroll-indicator" onClick={scrollToFeatures}>
          <div className="scroll-arrow">
            <span>↓</span>
          </div>
          <p>Discover Our Features</p>
        </div>

        <section className="features-section">
          <div className="feature-card" onClick={handleNavigation}>
            <h3>🎤 Advanced Speech Recognition</h3>
            <p>Transform spoken words into accurate text with state-of-the-art AI transcription technology. Our system supports multiple languages, accents, and dialects, delivering 95%+ accuracy even in noisy environments. Perfect for interviews, lectures, meetings, and any spoken content that needs to be documented.</p>
          </div>
          <div className="feature-card" onClick={handleNavigation}>
            <h3>📊 Intelligent Sentiment Analysis</h3>
            <p>Unlock the emotional intelligence of your content with our advanced sentiment analysis engine. Detect emotions, tone, and mood patterns throughout your videos. Understand audience reactions, identify key emotional moments, and optimize your content strategy based on psychological insights.</p>
          </div>
          <div className="feature-card" onClick={handleNavigation}>
            <h3>👁️ Computer Vision & Object Detection</h3>
            <p>See beyond the surface with our cutting-edge computer vision technology. Automatically identify and track people, objects, activities, and scenes throughout your videos. Get detailed insights about visual elements, movement patterns, and contextual information that helps you understand what's happening in your content.</p>
          </div>
          <div className="feature-card" onClick={handleNavigation}>
            <h3>📝 AI-Powered Smart Summaries</h3>
            <p>Condense hours of video content into digestible, actionable summaries. Our AI extracts key points, highlights important moments, and creates comprehensive overviews that save you time while ensuring you never miss critical information. Perfect for long-form content, educational materials, and business presentations.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
