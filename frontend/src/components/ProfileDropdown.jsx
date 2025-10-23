import React, { useState, useRef, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import '../styles/ProfileDropdown.css';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      if (isOpen && buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: buttonRect.bottom + 12,
          right: window.innerWidth - buttonRect.right
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isOpen]);

  const handleProfileClick = () => {
    if (!isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: buttonRect.bottom + 12,
        right: window.innerWidth - buttonRect.right
      });
    }
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (action) => {
    switch(action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        console.log('Settings button pressed');
        break;
      case 'help':
        console.log('Help button pressed');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        console.log(`Clicked: ${action}`);
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    supabase.auth.signOut();
    navigate('/');
  }

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button 
        ref={buttonRef}
        className="profile-button"
        onClick={handleProfileClick}
        aria-label="Profile menu"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </button>

      {isOpen && (
        <div 
          className="dropdown-menu"
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`,
            zIndex: 2147483647
          }}
        >
          <div className="menu-item" onClick={() => handleMenuItemClick('profile')}>
            <span>👤</span>
            Profile
          </div>
          <div className="menu-item" onClick={() => handleMenuItemClick('settings')}>
            <span>⚙️</span>
            Settings
          </div>
          <div className="menu-item" onClick={() => handleMenuItemClick('help')}>
            <span>❓</span>
            Help
          </div>
          <div className="menu-divider"></div>
          <div className="theme-section">
            <span className="theme-label">Theme</span>
            <ThemeToggle />
          </div>
          <div className="menu-divider"></div>
          <div className="menu-item logout" onClick={() => handleMenuItemClick('logout')}>
            <span>🚪</span>
            Logout
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
