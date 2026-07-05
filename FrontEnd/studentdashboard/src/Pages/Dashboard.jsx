// src/Pages/Dashboard.jsx

import React from 'react'

function Dashboard() {
  const studentData = JSON.parse(
    localStorage.getItem("student")
  );

  return (
    <div>
      <h2>Student Dashboard</h2>

      <h3>Welcome {studentData.user.fname}</h3>
      <h3>Email {studentData.user.email}</h3>

    </div>
  )
}

export default Dashboard;