// src/Pages/admindashboard.jsx
// FrontEnd/studentdashboard/src/Pages/Admindashboard.jsx
// src/Pages/admindashboard.jsx

import React, { useState } from 'react';
import API from '../Services/api';
import './Admindashboard.css';

function Admindashboard() {

    const [ActiveSelection, setActiveSelection] = useState("");
    const [students, setStudents] = useState([])
    const [showStudents, setshowStudents] = useState(false)
    const [studentdata, setstudentdata] = useState({
        fname: "",
        email: "",
        password: "",
        role: "student"
    });

    const handlechange = (e) => {
        setstudentdata({
            ...studentdata,
            [e.target.name]: e.target.value
        });
    };


    const get_students = async () => {

        try {
            const reponse = await API.get("/students");
            console.log(reponse.data);
            setStudents(reponse.data)
            setshowStudents(true)
        }
        catch (error) {
            console.log(error)
        }
    }

    const createstudent = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post("/signup", studentdata)

            alert(response.data.message);
            setstudentsdata({
                fname: "",
                email: "",
                password: "",
                role: "student"
            });
            get_students();
        }
        catch (error) {
            console.log(error);
        }

    };

    return (
        <>
            <nav className="navbar navbar-dark bg-dark px-3">

                <h2 className="text-white">
                    Admin Dashboard
                </h2>

                <div className="dropdown">

                    <button className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
                        CRUD
                    </button>

                    <ul className="dropdown-menu">

                        <li>
                            <button className="dropdown-item" onClick={() => setActiveSelection("create")}>
                                Create
                            </button>
                        </li>

                        <li>
                            <button className="dropdown-item" onClick={() => setActiveSelection("read")}>
                                Read
                            </button>
                        </li>

                        <li>
                            <button
                                className="dropdown-item"
                                onClick={() => setActiveSelection("update")}
                            >
                                Update
                            </button>
                        </li>

                        <li>
                            <button
                                className="dropdown-item"
                                onClick={() => setActiveSelection("delete")}
                            >
                                Delete
                            </button>
                        </li>

                    </ul>

                </div>

            </nav>
            {
                ActiveSelection == "create" && (
                    <div className='card'>
                        <h3>Create Student</h3>
                        <form onSubmit={createstudent}>
                            <label>Fname : </label>
                            <input type="text" name="fname" value={studentdata.fname} onChange={handlechange} />
                            <br />
                            <br />
                            <label>Email : </label>
                            <input type="text" name="email" value={studentdata.email} onChange={handlechange} />
                            <br />
                            <br />
                            <label>Password : </label>
                            <input type="text" name="password" value={studentdata.password} onChange={handlechange} />
                            <br />
                            <br />
                            <label>Role : </label>
                            <input type="text" name="role" value={studentdata.role} onChange={handlechange} />
                            <br />
                            <br />
                            <select name="role" value={studentdata.role} onChange={handlechange}>
                                <option value="student">Student</option>

                                <option value="admin"> Admin </option>
                            </select>

                            <br />
                            <br />

                            <button type="submit" className="btn btn-success">Create Student </button>

                        </form>
                    </div>
                )
            }

            {
                ActiveSelection == "read" && (
                    <div>
                        <button className='btn btn-primary' onClick={get_students}>Load Students</button>

                        <table className='table table-dark'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    students.map((student) => (
                                        <tr key={student.id}>

                                            <td>{student.id}</td>
                                            <td>{student.fname}</td>
                                            <td>{student.email}</td>
                                            <td>{student.role}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>

                    </div>
                )
            }
            {
                ActiveSelection == "delete" && (
                    <form>
                        <input type="email" placeholder='Enter Email' />
                        <br />
                        <button className='btn btn-danger'>Delete Student</button>
                    </form>
                )
            }
        </>
    );
}

export default Admindashboard;