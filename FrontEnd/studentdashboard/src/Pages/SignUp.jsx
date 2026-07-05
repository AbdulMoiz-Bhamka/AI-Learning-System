// src/Pages/SignUp.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../Services/api';


function SignUp() {

    const [formdata, setformdata] = useState({
        fname: "",
        email: "",
        password: ""
    });

    const handlechange = (e) => {
        setformdata({
            ...formdata,
            [e.target.name]: e.target.value
        });
    };

    let submit = async (e) => {
        e.preventDefault();

        try {
            const respose = await API.post("/signup", formdata);
            console.log(respose.data)
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h3>Sign UP</h3>
            <div className='signup-form'>
                <form onSubmit={submit}>
                    <h3>Register Here</h3>
                    <div className='mb-5'>
                        <label>Enter Your Full Name</label>
                        <input type="text" className='fname' name='fname' value={formdata.fname} onChange={handlechange} />
                        <br />
                        <label>Enter Email</label>
                        <input type="email" className='email' name='email' value={formdata.email} onChange={handlechange} />
                        <br />
                        <label>Enter Password</label>
                        <input type="password" name='password' className='password' value={formdata.password} onChange={handlechange} />
                        <br />
                        <button className='btn btn-primary'>Submit</button>
                        <li> <Link to={"/login"}>  Login </Link> </li>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp;