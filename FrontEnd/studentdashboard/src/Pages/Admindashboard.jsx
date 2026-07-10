// src/Pages/Admindashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../Services/api';
import './Admindashboard.css';

function Admindashboard() {
    const navigate = useNavigate();
    const [ActiveSelection, setActiveSelection] = useState("overview");
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [studentdata, setstudentdata] = useState({
        fname: "",
        email: "",
        password: "",
        role: "student"
    });
    const [deleteEmail, setDeleteEmail] = useState("");
    
    // Assign courses state
    const [selectedStudentForCourse, setSelectedStudentForCourse] = useState("");
    const [selectedCourseIds, setSelectedCourseIds] = useState([]);

    // Upload book state
    const [uploadCourseName, setUploadCourseName] = useState("");
    const [uploadFile, setUploadFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Fallback info for admin
    const adminSessionData = JSON.parse(localStorage.getItem("student")) || {
        user: { fname: "Admin Portal", email: "admin@gmail.com" }
    };

    // Auto-load students list on mount to populate total counts and tables
    useEffect(() => {
        get_students();
        get_courses();
    }, []);

    const get_courses = async () => {
        try {
            const response = await API.get("/courses");
            setCourses(response.data);
        } catch (error) {
            console.error("Failed to load courses", error);
        }
    };

    const handlechange = (e) => {
        setstudentdata({
            ...studentdata,
            [e.target.name]: e.target.value
        });
    };

    const get_students = async () => {
        setIsLoading(true);
        try {
            const response = await API.get("/students");
            console.log(response.data);
            setStudents(response.data);
        } catch (error) {
            console.error("Failed to load students", error);
        } finally {
            setIsLoading(false);
        }
    };

    const createstudent = async (e) => {
        e.preventDefault();
        if (!studentdata.fname || !studentdata.email || !studentdata.password) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            const response = await API.post("/signup", studentdata);
            alert(response.data.message || "Student Created Successfully");
            setstudentdata({
                fname: "",
                email: "",
                password: "",
                role: "student"
            });
            get_students(); // Refresh list
            setActiveSelection("read"); // Direct to table to see changes
        } catch (error) {
            console.error(error);
            alert("Error creating student.");
        }
    };

    const handleMockDelete = (e) => {
        e.preventDefault();
        if (!deleteEmail) return;
        
        // Simulating local deletion since FastAPI doesn't have a /delete route
        const studentExists = students.some(s => s.email === deleteEmail);
        if (studentExists) {
            setStudents(prev => prev.filter(s => s.email !== deleteEmail));
            alert(`Simulated: Student with email ${deleteEmail} has been deleted.`);
            setDeleteEmail("");
            setActiveSelection("read");
        } else {
            alert(`No student found with email: ${deleteEmail}`);
        }
    };

    const handleAssignCourses = async (e) => {
        e.preventDefault();
        if (!selectedStudentForCourse) {
            alert("Please select a student.");
            return;
        }
        try {
            const response = await API.post(`/students/${selectedStudentForCourse}/courses`, {
                course_ids: selectedCourseIds
            });
            alert(response.data.message || "Courses assigned successfully");
            setSelectedStudentForCourse("");
            setSelectedCourseIds([]);
        } catch (error) {
            console.error(error);
            alert("Failed to assign courses");
        }
    };

    const handleCourseCheckbox = (courseId) => {
        setSelectedCourseIds(prev => 
            prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
        );
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!uploadCourseName || !uploadFile) {
            alert("Please select a course and a file.");
            return;
        }
        
        setIsUploading(true);
        const formData = new FormData();
        formData.append("course_name", uploadCourseName);
        formData.append("file", uploadFile);

        try {
            const response = await API.post("/admin/upload-book", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert(response.data.message || "Book processed and uploaded successfully.");
            setUploadCourseName("");
            setUploadFile(null);
        } catch (error) {
            console.error(error);
            alert("Failed to upload and process book: " + (error.response?.data?.detail || error.message));
        } finally {
            setIsUploading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("student");
        navigate("/login");
    };

    return (
        <div className="admin-layout">
            {/* Admin Left Sidebar */}
            <aside className="admin-sidebar glass-card">
                <div className="admin-sidebar-brand">
                    <span>⚡</span> EduAI Admin
                </div>

                <div className="admin-profile-widget">
                    <div className="admin-avatar-circle">A</div>
                    <div className="admin-profile-info">
                        <h4>{adminSessionData.user.fname}</h4>
                        <span className="badge-glow badge-glow-admin">Administrator</span>
                    </div>
                </div>

                <nav className="admin-sidebar-menu">
                    <button 
                        className={`admin-menu-item ${ActiveSelection === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveSelection("overview")}
                    >
                        <span>📊</span> System Overview
                    </button>
                    <button 
                        className={`admin-menu-item ${ActiveSelection === 'read' ? 'active' : ''}`}
                        onClick={() => setActiveSelection("read")}
                    >
                        <span>👥</span> Student Registry
                    </button>
                    <button 
                        className={`admin-menu-item ${ActiveSelection === 'create' ? 'active' : ''}`}
                        onClick={() => setActiveSelection("create")}
                    >
                        <span>➕</span> Create User
                    </button>
                    <button 
                        className={`admin-menu-item ${ActiveSelection === 'assign' ? 'active' : ''}`}
                        onClick={() => setActiveSelection("assign")}
                    >
                        <span>📚</span> Assign Courses
                    </button>
                    <button 
                        className={`admin-menu-item ${ActiveSelection === 'upload' ? 'active' : ''}`}
                        onClick={() => setActiveSelection("upload")}
                    >
                        <span>📤</span> Upload Books
                    </button>
                    <button 
                        className={`admin-menu-item ${ActiveSelection === 'delete' ? 'active' : ''}`}
                        onClick={() => setActiveSelection("delete")}
                    >
                        <span>❌</span> Delete User
                    </button>
                </nav>

                <div className="admin-sidebar-footer">
                    <button onClick={handleLogout} className="admin-btn-logout">
                        <span>🚪</span> Log Out
                    </button>
                </div>
            </aside>

            {/* Admin Viewport */}
            <main className="admin-viewport">
                {/* Header */}
                <header className="admin-viewport-header glass-card">
                    <div>
                        <h2>Administrator Console</h2>
                        <p>Manage system registries, review database metrics, and control authorization rolls.</p>
                    </div>
                    <div className="system-status-indicator">
                        <span className="badge-glow badge-glow-student">Database: Online</span>
                    </div>
                </header>

                <div className="admin-viewport-content">

                    {/* OVERVIEW PANEL */}
                    {ActiveSelection === "overview" && (
                        <div className="admin-tab-pane fade-in">
                            <div className="admin-metrics-grid">
                                <div className="admin-metric-box glass-card">
                                    <div className="admin-metric-icon">👥</div>
                                    <div className="admin-metric-data">
                                        <h3>{students.length}</h3>
                                        <p>Registered Students</p>
                                    </div>
                                </div>
                                <div className="admin-metric-box glass-card">
                                    <div className="admin-metric-icon">🎛️</div>
                                    <div className="admin-metric-data">
                                        <h3>{courses.length}</h3>
                                        <p>Active Subject Modules</p>
                                    </div>
                                </div>
                                <div className="admin-metric-box glass-card">
                                    <div className="admin-metric-icon">💻</div>
                                    <div className="admin-metric-data">
                                        <h3>100%</h3>
                                        <p>Server Uptime</p>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-overview-panel glass-card">
                                <h3>Quick Actions</h3>
                                <p>Perform standard database entries and control student profile tables.</p>
                                <div className="admin-quick-actions-row">
                                    <button 
                                        className="btn-premium-primary"
                                        onClick={() => setActiveSelection("create")}
                                    >
                                        Add New Student Profile
                                    </button>
                                    <button 
                                        className="btn-premium-secondary"
                                        onClick={() => setActiveSelection("read")}
                                    >
                                        Inspect Student Database
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* READ (REGISTRY TABLE) PANEL */}
                    {ActiveSelection === "read" && (
                        <div className="admin-tab-pane fade-in">
                            <div className="admin-table-container glass-card">
                                <div className="table-header-row">
                                    <h3>Student Authorization Records</h3>
                                    <button 
                                        className="btn-premium-secondary refresh-btn"
                                        onClick={get_students}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Refreshing..." : "🔄 Refresh"}
                                    </button>
                                </div>

                                {students.length === 0 ? (
                                    <p className="no-students-placeholder">No students found. Load the database or register a new user.</p>
                                ) : (
                                    <table className="admin-students-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Full Name</th>
                                                <th>Email Address</th>
                                                <th>Auth Role</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student) => (
                                                <tr key={student.id}>
                                                    <td>{student.id}</td>
                                                    <td className="student-name-cell">{student.fname}</td>
                                                    <td>{student.email}</td>
                                                    <td>
                                                        <span className={`badge-glow ${student.role === 'admin' ? 'badge-glow-admin' : 'badge-glow-student'}`}>
                                                            {student.role || "student"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                    {/* CREATE PANEL */}
                    {ActiveSelection === "create" && (
                        <div className="admin-tab-pane fade-in">
                            <div className="admin-form-card glass-card">
                                <h3>Register New Student Profile</h3>
                                <p className="text-muted">Enter core student details to add authorization keys to SQL Server.</p>

                                <form onSubmit={createstudent} className="admin-form-grid">
                                    <div className="form-group-custom">
                                        <label>Full Name</label>
                                        <input 
                                            type="text" 
                                            name="fname" 
                                            className="form-input-custom"
                                            placeholder="Jane Doe"
                                            value={studentdata.fname} 
                                            onChange={handlechange} 
                                            required
                                        />
                                    </div>

                                    <div className="form-group-custom">
                                        <label>Email Address</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            className="form-input-custom"
                                            placeholder="jane@gmail.com"
                                            value={studentdata.email} 
                                            onChange={handlechange} 
                                            required
                                        />
                                    </div>

                                    <div className="form-group-custom">
                                        <label>Password</label>
                                        <input 
                                            type="password" 
                                            name="password" 
                                            className="form-input-custom"
                                            placeholder="••••••••"
                                            value={studentdata.password} 
                                            onChange={handlechange} 
                                            required
                                        />
                                    </div>

                                    <div className="form-group-custom">
                                        <label>Account Role</label>
                                        <select 
                                            name="role" 
                                            className="form-input-custom select-custom"
                                            value={studentdata.role} 
                                            onChange={handlechange}
                                        >
                                            <option value="student">Student</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>

                                    <button type="submit" className="btn-premium-primary admin-submit-btn">
                                        Insert Database Entry ➔
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* ASSIGN COURSES PANEL */}
                    {ActiveSelection === "assign" && (
                        <div className="admin-tab-pane fade-in">
                            <div className="admin-form-card glass-card">
                                <h3>Assign Courses to Student</h3>
                                <p className="text-muted">Select a student and assign them available courses.</p>

                                <form onSubmit={handleAssignCourses} className="admin-form-grid">
                                    <div className="form-group-custom" style={{ gridColumn: "1 / -1" }}>
                                        <label>Select Student</label>
                                        <select 
                                            className="form-input-custom select-custom"
                                            value={selectedStudentForCourse} 
                                            onChange={(e) => setSelectedStudentForCourse(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Choose a Student --</option>
                                            {students.filter(s => s.role !== 'admin').map(student => (
                                                <option key={student.id} value={student.id}>
                                                    {student.fname} ({student.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group-custom courses-checkbox-group" style={{ gridColumn: "1 / -1" }}>
                                        <label>Select Courses</label>
                                        <div className="courses-grid">
                                            {courses.map(course => (
                                                <label key={course.id} className="course-checkbox-label">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedCourseIds.includes(course.id)}
                                                        onChange={() => handleCourseCheckbox(course.id)}
                                                    />
                                                    <span className="course-checkbox-text">
                                                        {course.icon} {course.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-premium-primary admin-submit-btn">
                                        Assign Selected Courses ➔
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* UPLOAD BOOK PANEL */}
                    {ActiveSelection === "upload" && (
                        <div className="admin-tab-pane fade-in">
                            <div className="admin-form-card glass-card">
                                <h3>Upload Course Material (PDF/TXT)</h3>
                                <p className="text-muted">Upload textbooks or notes to be processed, chunked, and embedded into the Qdrant Vector DB for the AI Tutor.</p>

                                <form onSubmit={handleFileUpload} className="admin-form-grid">
                                    <div className="form-group-custom" style={{ gridColumn: "1 / -1" }}>
                                        <label>Target Course</label>
                                        <select 
                                            className="form-input-custom select-custom"
                                            value={uploadCourseName} 
                                            onChange={(e) => setUploadCourseName(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Select Course --</option>
                                            {courses.map(course => (
                                                <option key={course.id} value={course.name}>
                                                    {course.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group-custom file-upload-group" style={{ gridColumn: "1 / -1" }}>
                                        <label>Select Book/Notes File</label>
                                        <div className="file-upload-box">
                                            <input 
                                                type="file" 
                                                accept=".pdf,.txt"
                                                onChange={(e) => setUploadFile(e.target.files[0])}
                                                required 
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn-premium-primary admin-submit-btn"
                                        disabled={isUploading}
                                    >
                                        {isUploading ? "Processing & Embedding... ⏳" : "Upload & Embed to Qdrant ➔"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* DELETE PANEL */}
                    {ActiveSelection === "delete" && (
                        <div className="admin-tab-pane fade-in">
                            <div className="admin-form-card glass-card delete-warning-card">
                                <h3>Remove Student Profile</h3>
                                <p className="text-muted">Enter the email address of the student account you wish to remove from the registry.</p>
                                
                                <div className="admin-warning-banner">
                                    <span>⚠️</span> <strong>Caution:</strong> Deletion removes student credentials and learning history.
                                </div>

                                <form onSubmit={handleMockDelete} className="admin-delete-form">
                                    <div className="form-group-custom">
                                        <label>Email Address</label>
                                        <input 
                                            type="email" 
                                            className="form-input-custom"
                                            placeholder="enter.email@student.com"
                                            value={deleteEmail} 
                                            onChange={(e) => setDeleteEmail(e.target.value)} 
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn-premium-primary btn-delete-submit">
                                        Remove Credentials entry
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}

export default Admindashboard;