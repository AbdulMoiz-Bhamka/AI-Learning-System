// src/Pages/Dashboard.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../Services/api';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const chatEndRef = useRef(null);

    // Safety fallback for dev testing
    const studentData = JSON.parse(localStorage.getItem("student")) || {
        user: { fname: "Alex Mercer", email: "alex.mercer@edu.com", role: "student" }
    };

    const [activeTab, setActiveTab] = useState("overview");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const fileInputRef = useRef(null);

    // Fetch dynamic subjects on mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await API.get(`/students/${studentData.user.id}/courses`);
                setSubjects(response.data);
                if (response.data.length > 0) {
                    setSelectedSubject(response.data[0].name);
                }
            } catch (error) {
                console.error("Failed to fetch assigned courses", error);
            }
        };
        fetchCourses();
    }, [studentData.user.id]);

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setAttachedFiles(prev => [...prev, ...files]);
        }
    };

    const removeAttachedFile = (indexToRemove) => {
        setAttachedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };
    
    // Chat history state initialized with context messages
    const [chatHistories, setChatHistories] = useState({
        Physics: [
            { sender: "tutor", text: "Hello! I am your AI Physics Tutor. Today, we can discuss Newton's laws of motion, gravity, or electromagnetism. What would you like to explore?" }
        ],
        Mathematics: [
            { sender: "tutor", text: "Welcome to Math Lab! Ready to conquer Calculus? Let me know if you need help with derivatives, integration, or limits." }
        ],
        Chemistry: [
            { sender: "tutor", text: "Hi there! Let's explore the elements together. Tell me if you are looking at balancing equations or understanding molarity." }
        ],
        Literature: [
            { sender: "tutor", text: "Greetings! I'm here to analyze characters, themes, and motifs. Share the text or question you are working on!" }
        ],
        "Data Structures": [
            { sender: "tutor", text: "Welcome to Data Structures! Do you want to discuss arrays, trees, or perhaps graphs today?" }
        ],
        "Algorithms": [
            { sender: "tutor", text: "Hello! Let's dive into sorting and searching algorithms, or we could tackle dynamic programming." }
        ],
        "Database Systems": [
            { sender: "tutor", text: "Hi! Ready to learn SQL and database normalization?" }
        ],
        "Web Development": [
            { sender: "tutor", text: "Welcome! Let's talk about full stack web development with React and FastAPI." }
        ]
    });

    const activeHistory = useMemo(() => {
        return chatHistories[selectedSubject] || [];
    }, [chatHistories, selectedSubject]);

    // Scroll to bottom of chat
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeHistory, isTyping]);

    const handleLogout = () => {
        localStorage.removeItem("student");
        navigate("/login");
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim() && attachedFiles.length === 0) return;

        const userMsg = inputMessage || "Uploaded file(s)";
        
        // 1. Add User Message
        setChatHistories(prev => ({
            ...prev,
            [selectedSubject]: [...prev[selectedSubject], { sender: "user", text: userMsg, files: attachedFiles }]
        }));
        
        setInputMessage("");
        setAttachedFiles([]);
        setIsTyping(true);

        // 2. Simulate AI Tutor response stream after delay
        setTimeout(() => {
            let aiText = "";
            const lowerMsg = userMsg.toLowerCase();

            // Custom context-aware simulation logic
            if (selectedSubject === "Physics") {
                if (lowerMsg.includes("newton") || lowerMsg.includes("law")) {
                    aiText = "Newton's First Law says an object stays at rest unless acted on by a net force. The Second Law is F = ma (Force equals mass times acceleration). The Third Law is action-reaction! Which of these should we derive?";
                } else if (lowerMsg.includes("gravity") || lowerMsg.includes("g ")) {
                    aiText = "Gravity is an attractive force between objects with mass. On Earth, acceleration due to gravity is approximately 9.8 m/s². The gravitational force formula is F = G*(m1*m2)/r².";
                } else {
                    aiText = `That is an interesting physics question! Regarding "${userMsg}", let's break it down into force vectors and energy conservation. Tell me more about what variables you know.`;
                }
            } else if (selectedSubject === "Mathematics") {
                if (lowerMsg.includes("derivative") || lowerMsg.includes("calculus")) {
                    aiText = "A derivative measures the instantaneous rate of change, or the slope of the tangent line to a curve. For example, the derivative of x² is 2x using the Power Rule!";
                } else if (lowerMsg.includes("limit")) {
                    aiText = "Limits describe the value that a function approaches as the input approaches some value. They form the core foundation of calculus.";
                } else {
                    aiText = `Ah, a classic algebra problem! To solve for "${userMsg}", we should first isolate the variable. Let's list the steps together.`;
                }
            } else if (selectedSubject === "Chemistry") {
                if (lowerMsg.includes("acid") || lowerMsg.includes("ph")) {
                    aiText = "pH is the negative logarithm of the hydrogen ion concentration. Acids have a pH less than 7, bases have a pH greater than 7. Water is neutral at pH 7!";
                } else {
                    aiText = `Let's analyze that molecule! In general, molecular bonds can be ionic or covalent depending on the electronegativity difference between atoms.`;
                }
            } else {
                aiText = `Interesting perspective on the text. When analyzing literary themes, it is important to find direct quotes that highlight the author's intention. Let's unpack this theme further.`;
            }

            setChatHistories(prev => ({
                ...prev,
                [selectedSubject]: [...prev[selectedSubject], { sender: "tutor", text: aiText }]
            }));
            setIsTyping(false);
        }, 1500);
    };

    const handleStarterPrompt = (promptText) => {
        setInputMessage(promptText);
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar Navigation */}
            <aside className="sidebar glass-card">
                <div className="sidebar-brand">
                    <span>⚡</span> EduAI
                </div>
                
                <div className="user-profile-widget">
                    <div className="avatar-circle">
                        {studentData.user.fname.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                        <h4>{studentData.user.fname}</h4>
                        <span className="badge-glow badge-glow-student">Student</span>
                    </div>
                </div>

                <nav className="sidebar-menu">
                    <button 
                        className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab("overview")}
                    >
                        <span>📊</span> Overview
                    </button>
                    <button 
                        className={`menu-item ${activeTab === 'chat' ? 'active' : ''}`}
                        onClick={() => setActiveTab("chat")}
                    >
                        <span>🤖</span> AI Tutor Chat
                    </button>
                    <button 
                        className={`menu-item ${activeTab === 'subjects' ? 'active' : ''}`}
                        onClick={() => setActiveTab("subjects")}
                    >
                        <span>🧬</span> My Subjects
                    </button>
                    <button 
                        className={`menu-item ${activeTab === 'progress' ? 'active' : ''}`}
                        onClick={() => setActiveTab("progress")}
                    >
                        <span>📈</span> Progress Tracker
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="btn-logout">
                        <span>🚪</span> Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="dashboard-viewport">
                {/* Header */}
                <header className="viewport-header glass-card">
                    <div className="header-greeting">
                        <h2>Welcome back, {studentData.user.fname}!</h2>
                        <p>Your AI tutors are ready to help you learn today.</p>
                    </div>
                    <div className="header-stats">
                        <div className="mini-stat">
                            <span className="stat-label">System Status</span>
                            <span className="stat-val text-success">● Active</span>
                        </div>
                    </div>
                </header>

                {/* Viewport Content based on activeTab */}
                <div className="viewport-content">
                    
                    {/* OVERVIEW TAB */}
                    {activeTab === "overview" && (
                        <div className="tab-pane fade-in">
                            <div className="metrics-grid">
                                <div className="metric-box glass-card">
                                    <div className="metric-icon">⏱️</div>
                                    <div className="metric-data">
                                        <h3>29.5 hrs</h3>
                                        <p>Total Study Time</p>
                                    </div>
                                </div>
                                <div className="metric-box glass-card">
                                    <div className="metric-icon">💬</div>
                                    <div className="metric-data">
                                        <h3>142</h3>
                                        <p>AI Queries Asked</p>
                                    </div>
                                </div>
                                <div className="metric-box glass-card">
                                    <div className="metric-icon">🎯</div>
                                    <div className="metric-data">
                                        <h3>78%</h3>
                                        <p>Avg Mastery Score</p>
                                    </div>
                                </div>
                            </div>

                            <div className="overview-row">
                                <div className="overview-left glass-card">
                                    <h3>Quick Start: Ask your Tutor</h3>
                                    <p>Select a subject and load up the interactive whiteboard to chat with our advanced LLM models.</p>
                                    <div className="subject-quick-selects">
                                        {subjects.map((sub, i) => (
                                            <button 
                                                key={i} 
                                                className={`sub-pill ${selectedSubject === sub.name ? 'active' : ''}`}
                                                onClick={() => {
                                                    setSelectedSubject(sub.name);
                                                    setActiveTab("chat");
                                                }}
                                            >
                                                {sub.icon} {sub.name}
                                            </button>
                                        ))}
                                    </div>
                                    <button 
                                        className="btn-premium-primary overview-cta-btn"
                                        onClick={() => setActiveTab("chat")}
                                    >
                                        Launch AI Chat Room 🚀
                                    </button>
                                </div>

                                <div className="overview-right glass-card">
                                    <h3>Recent Activity</h3>
                                    <ul className="activity-list">
                                        <li>
                                            <span className="activity-icon">📐</span>
                                            <div className="activity-details">
                                                <p>Completed lesson on <strong>Integrals</strong> in Math</p>
                                                <span>2 hours ago</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="activity-icon">🌌</span>
                                            <div className="activity-details">
                                                <p>Asked 12 questions to the Physics AI Tutor</p>
                                                <span>Yesterday</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="activity-icon">🧪</span>
                                            <div className="activity-details">
                                                <p>Completed <strong>Gas Laws</strong> diagnostic test</p>
                                                <span>3 days ago</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AI TUTOR CHAT TAB */}
                    {activeTab === "chat" && (
                        <div className="chat-container-pane glass-card fade-in">
                            {/* Chat Subjects Sidebar */}
                            <div className="chat-sidebar">
                                <h3>Active Tutors</h3>
                                <div className="tutor-list">
                                    {subjects.map((sub, i) => (
                                        <button 
                                            key={i} 
                                            className={`tutor-item ${selectedSubject === sub.name ? 'active' : ''}`}
                                            onClick={() => setSelectedSubject(sub.name)}
                                        >
                                            <span className="tutor-icon">{sub.icon}</span>
                                            <div className="tutor-details-nav">
                                                <span className="tutor-name">{sub.name} Tutor</span>
                                                <span className="tutor-subtext">{sub.tutor}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Chat Box Area */}
                            <div className="chat-viewport">
                                <div className="chat-viewport-header">
                                    <div className="header-tutor-avatar">
                                        {subjects.find(s => s.name === selectedSubject)?.icon}
                                    </div>
                                    <div>
                                        <h4>{selectedSubject} Tutor</h4>
                                        <span className="online-tag">● online</span>
                                    </div>
                                </div>

                                <div className="chat-messages-container">
                                    {activeHistory.map((msg, index) => (
                                        <div key={index} className={`chat-row ${msg.sender === 'user' ? 'user-row' : 'tutor-row'}`}>
                                            <div className="chat-bubble-dashboard">
                                                {msg.files && msg.files.length > 0 && (
                                                    <div className="chat-attached-files">
                                                        {msg.files.map((f, i) => (
                                                            <div key={i} className="chat-file-badge">📄 {f.name}</div>
                                                        ))}
                                                    </div>
                                                )}
                                                {msg.text && <p>{msg.text}</p>}
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {isTyping && (
                                        <div className="chat-row tutor-row">
                                            <div className="chat-bubble-dashboard typing">
                                                <div className="typing-indicator">
                                                    <span></span><span></span><span></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Quick Prompt Suggestions */}
                                <div className="prompt-suggestions">
                                    <span className="suggestion-label">Suggestions:</span>
                                    {selectedSubject === "Physics" && (
                                        <>
                                            <button onClick={() => handleStarterPrompt("Explain Newton's second law")} className="btn-suggestion">Explain Newton's Second Law</button>
                                            <button onClick={() => handleStarterPrompt("Formula for gravity")} className="btn-suggestion">Formula for Gravity</button>
                                        </>
                                    )}
                                    {selectedSubject === "Mathematics" && (
                                        <>
                                            <button onClick={() => handleStarterPrompt("What is a derivative?")} className="btn-suggestion">What is a Derivative?</button>
                                            <button onClick={() => handleStarterPrompt("Explain limits in calculus")} className="btn-suggestion">Explain Calculus Limits</button>
                                        </>
                                    )}
                                    {selectedSubject === "Chemistry" && (
                                        <>
                                            <button onClick={() => handleStarterPrompt("Explain the pH scale")} className="btn-suggestion">Explain the pH scale</button>
                                        </>
                                    )}
                                    {selectedSubject === "Literature" && (
                                        <>
                                            <button onClick={() => handleStarterPrompt("How to write a thesis statement")} className="btn-suggestion">How to write a thesis statement</button>
                                        </>
                                    )}
                                </div>

                                {/* Input Bar */}
                                <div className="chat-input-wrapper">
                                    {attachedFiles.length > 0 && (
                                        <div className="attached-files-preview">
                                            {attachedFiles.map((file, idx) => (
                                                <div key={idx} className="attached-file-badge">
                                                    <span className="file-icon">📄</span>
                                                    <span className="file-name">{file.name}</span>
                                                    <button type="button" onClick={() => removeAttachedFile(idx)} className="btn-remove-file">✕</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <form onSubmit={handleSendMessage} className="chat-input-bar">
                                        <button 
                                            type="button" 
                                            className="btn-upload-file" 
                                            onClick={() => fileInputRef.current.click()}
                                            title="Upload file or notes"
                                        >
                                            +
                                        </button>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            style={{ display: 'none' }} 
                                            multiple 
                                            onChange={handleFileUpload} 
                                        />
                                        <input 
                                            type="text" 
                                            placeholder={`Message your ${selectedSubject} Tutor...`}
                                            className="chat-input-field"
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                        />
                                        <button type="submit" className="btn-send-chat">Send ➔</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SUBJECTS GRID TAB */}
                    {activeTab === "subjects" && (
                        <div className="subjects-view fade-in">
                            <div className="subjects-grid">
                                {subjects.map((sub, i) => (
                                    <div key={i} className="subject-card-dashboard glass-card">
                                        <div className="subject-card-header">
                                            <span className="sub-avatar">{sub.icon}</span>
                                            <div>
                                                <h4>{sub.name}</h4>
                                                <span className="text-muted">{sub.tutor}</span>
                                            </div>
                                        </div>
                                        <p className="sub-description">{sub.description}</p>
                                        <div className="sub-meta">
                                            <div className="sub-meta-stat">
                                                <span>⏱️ Study Time</span>
                                                <strong>{sub.hours} hrs</strong>
                                            </div>
                                            <div className="sub-meta-stat">
                                                <span>📊 Modules</span>
                                                <strong>12 Lessons</strong>
                                            </div>
                                        </div>
                                        
                                        <div className="progress-section">
                                            <div className="progress-labels">
                                                <span>Mastery Progress</span>
                                                <span>{sub.progress}%</span>
                                            </div>
                                            <div className="progress-bar-container">
                                                <div 
                                                    className="progress-bar-fill" 
                                                    style={{ width: `${sub.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <button 
                                            className="btn-premium-primary sub-card-btn"
                                            onClick={() => {
                                                setSelectedSubject(sub.name);
                                                setActiveTab("chat");
                                            }}
                                        >
                                            Consult AI Tutor
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PROGRESS TRACKER TAB */}
                    {activeTab === "progress" && (
                        <div className="progress-tracker-view glass-card fade-in">
                            <h3>Learning Diagnostics</h3>
                            <p className="text-muted">A detailed analysis of your learning speeds, accuracy, and AI interactions.</p>
                            
                            <div className="progress-charts-row">
                                <div className="diagnostic-stat-card">
                                    <h4>Accuracy Curve</h4>
                                    <div className="mock-chart">
                                        <div className="bar" style={{height: '60%'}}><span className="bar-label">W1</span></div>
                                        <div className="bar" style={{height: '72%'}}><span className="bar-label">W2</span></div>
                                        <div className="bar" style={{height: '80%'}}><span className="bar-label">W3</span></div>
                                        <div className="bar highlight" style={{height: '92%'}}><span className="bar-label">Current</span></div>
                                    </div>
                                </div>

                                <div className="diagnostic-details-card">
                                    <h4>Tutor Evaluation</h4>
                                    <div className="eval-row">
                                        <span>Concept Comprehension:</span>
                                        <strong>Excellent (88%)</strong>
                                    </div>
                                    <div className="eval-row">
                                        <span>Formula Application:</span>
                                        <strong>Good (76%)</strong>
                                    </div>
                                    <div className="eval-row">
                                        <span>Creative Problem Solving:</span>
                                        <strong>Developing (64%)</strong>
                                    </div>
                                    <div className="eval-row">
                                        <span>AI Consultation Frequency:</span>
                                        <strong>High (94th percentile)</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;