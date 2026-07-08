// src/Components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <div className="landing-container">
      {/* Floating Header */}
      <header className="main-header glass-card">
        <div className="logo-section">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Edu<span className="gradient-text">AI</span></span>
        </div>
        
        <nav className="nav-links">
          <Link to="/" className="nav-link active">Home</Link>
          <a href="#features" className="nav-link">Features</a>
          <a href="#subjects" className="nav-link">Subjects</a>
        </nav>

        <div className="auth-buttons">
          <Link to="/login" className="btn-login-nav">Sign In</Link>
          <Link to="/signup" className="btn-premium-primary btn-nav-cta">Get Started</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge-glow badge-glow-student">🤖 Powered by Advanced LLMs</div>
          <h1 className="hero-title">
            Your Personal <span className="gradient-text">AI Tutor</span> <br />
            Available 24/7 for Any Subject
          </h1>
          <p className="hero-subtitle">
            Experience a new era of education. Interactive lectures, real-time problem-solving, 
            and customized test prep styled specifically for your learning pace.
          </p>
          <div className="hero-ctas">
            <Link to="/signup" className="btn-premium-primary hero-btn">Start Learning Free</Link>
            <Link to="/login" className="btn-premium-secondary hero-btn">Enter Dashboard</Link>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="interactive-card glass-card">
            <div className="card-header">
              <div className="avatar-dot active"></div>
              <span>AI Physics Tutor</span>
            </div>
            <div className="chat-preview">
              <div className="chat-bubble received">
                "Hello! Can you help me understand Newton's third law of motion?"
              </div>
              <div className="chat-bubble sent">
                "Think of it like skateboarding: when you push back on the pavement with your foot, the pavement pushes you forward!"
              </div>
            </div>
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="features-section">
        <h2 className="section-title">Why Choose <span className="gradient-text">EduAI</span>?</h2>
        <div className="features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon">🧬</div>
            <h3>Deep Subject Expertise</h3>
            <p>From complex Calculus equations to English literature analysis, our AI adapters cover all academic layers.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon">⏱️</div>
            <h3>Immediate Feedback</h3>
            <p>No waiting for grading. Get line-by-line breakdowns of your essays and step-by-step math solver feedback.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon">📊</div>
            <h3>Smart Progress Tracking</h3>
            <p>Admin dashboards let teachers and administrators view metrics, manage access, and support student success.</p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 EduAI Learning System. Crafted for tomorrow's education.</p>
      </footer>
    </div>
  );
}

export default Navbar;