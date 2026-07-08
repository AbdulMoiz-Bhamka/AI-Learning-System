// src/Pages/SignUp.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../Services/api';
import './SignUp.css';

function SignUp() {
    const [formdata, setformdata] = useState({
        fname: "",
        email: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handlechange = (e) => {
        setformdata({
            ...formdata,
            [e.target.name]: e.target.value
        });
        if (errorMessage) setErrorMessage("");
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!formdata.fname || !formdata.email || !formdata.password) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        setSuccessMessage("");
        try {
            const response = await API.post("/signup", formdata);
            console.log(response.data);
            
            setSuccessMessage("Account created successfully! Redirecting...");
            setformdata({
                fname: "",
                email: "",
                password: ""
            });
        } catch (error) {
            console.log(error);
            setErrorMessage("Failed to create account. Email may already be in use.");
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
                    <h2>Create Account</h2>
                    <p>Join the AI tutor platform and start mastering your subjects</p>
                </div>

                {errorMessage && (
                    <div className="auth-error-banner">
                        <span>⚠️</span> {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="auth-success-banner">
                        <span>✅</span> {successMessage}
                    </div>
                )}

                <form onSubmit={submit} className="auth-form">
                    <div className="form-group-custom">
                        <label htmlFor="fname">Full Name</label>
                        <input 
                            type="text" 
                            id="fname"
                            name="fname" 
                            className="form-input-custom" 
                            placeholder="John Doe"
                            value={formdata.fname} 
                            onChange={handlechange} 
                            required
                        />
                    </div>

                    <div className="form-group-custom">
                        <label htmlFor="email">Email Address</label>
                        <input 
                            type="email" 
                            id="email"
                            name="email" 
                            className="form-input-custom" 
                            placeholder="john@example.com"
                            value={formdata.email} 
                            onChange={handlechange} 
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
                            placeholder="Min. 6 characters"
                            value={formdata.password} 
                            onChange={handlechange} 
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn-premium-primary btn-auth-submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Registering..." : "Sign Up"}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Login here</Link>
                </div>
            </div>
        </div>
    );
}

export default SignUp;