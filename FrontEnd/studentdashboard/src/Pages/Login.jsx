// src/Pages/Login.jsx

import React, { use, useState } from 'react';
import API from "../Services/api";
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();

    const [loginData, setloginData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setloginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            const response = await API.post("/login", loginData);
            console.log(response.data);
            if (response.data.user.role === 'admin') {
                navigate("/admin-dashboard")
            }
            else {
                navigate("/dashboard")
            }
            localStorage.setItem(
                "student",
                JSON.stringify(response.data)
            )
        }
        catch (error) {

            console.log(error);

        }
    };

    return (
        <div>

            <h3>Login Page</h3>

            <form onSubmit={handleSubmit}>

                <label>Email</label>

                <input type="email" name="email" value={loginData.email} onChange={handleChange} />

                <br />

                <label>Password</label>

                <input type="password" name="password" value={loginData.password} onChange={handleChange} />

                <br />
                <br />

                <button type="submit"> Login </button>

            </form>

        </div>
    );
}

export default Login;