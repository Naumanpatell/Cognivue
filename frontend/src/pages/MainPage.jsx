import React from "react";
import ThemeToggle from '../components/ThemeToggle';
import '../styles/HomeStyle.css'

function MainPage() {
    return (
      <div className="home-container">
        <header className="home-header">
          <div className="header-content">
            <h1>Cognivue</h1>
            <p className="tagline">THIS IS JUST A COPY OF THE LANDING PAGE, IM GOING TO CHANGE IT SOON</p>
          </div>
          <div className="header-controls">
            <ThemeToggle />
          </div>
        </header>
      </div>
    );
  }
  
  export default MainPage;
