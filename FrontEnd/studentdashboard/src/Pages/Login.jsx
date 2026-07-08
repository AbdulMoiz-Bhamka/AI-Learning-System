// src/Pages/Login.jsx
import React, { useState } from 'react';
import API from "../Services/api";
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [loginData, setloginData] = useState({
        email: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setloginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
        if (errorMessage) setErrorMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!loginData.email || !loginData.password) {
            setErrorMessage("Please fill in all fields.");
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await API.post("/login", loginData);
            console.log(response.data);
            
            if (response.data.message === "User not found" || response.data.message === "Invalid Password") {
                setErrorMessage(response.data.message);
                setIsLoading(false);
                return;
            }

            localStorage.setItem(
                "student",
                JSON.stringify(response.data)
            );

            if (response.data.user.role === 'admin') {
                navigate("/admin-dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Server error. Please ensure FastAPI is running.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-background-glows"></div>
            
            <div className="auth-card glass-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <span>⚡</span> EduAI
                    </div>
                    <h2>Welcome Back</h2>
                    <p>Enter your credentials to access your tutoring dashboard</p>
                </div>

                {errorMessage && (
                    <div className="auth-error-banner">
                        <span>⚠️</span> {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group-custom">
                        <label htmlFor="email">Email Address</label>
                        <input 
                            type="email" 
                            id="email"
                            name="email" 
                            className="form-input-custom"
                            placeholder="name@example.com"
                            value={loginData.email} 
                            onChange={handleChange} 
                            required
                        />
                    </div>

                    <div className="form-group-custom">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            name="password" 
                            className="form-input-custom"
                            placeholder="••••••••"
                            value={loginData.password} 
                            onChange={handleChange} 
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn-premium-primary btn-auth-submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/signup" className="auth-link">Register here</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;