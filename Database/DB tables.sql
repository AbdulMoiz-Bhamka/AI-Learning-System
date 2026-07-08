Create database StudentLLM;

use StudentLLM;


CREATE TABLE StudentsAuth
(
    id INT PRIMARY KEY IDENTITY(1,1),
    fname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
	role varchar(255) Not Null
);

Insert into StudentsAuth(fname , email , password, role) VALUES ('admin', 'admin@gmail.com', 123 , 'admin')


CREATE TABLE Courses
(
    id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    tutor VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    progress INT DEFAULT 0,
    hours DECIMAL(5, 1) DEFAULT 0.0
);

CREATE TABLE StudentCourses
(
    id INT PRIMARY KEY IDENTITY(1,1),
    student_id INT FOREIGN KEY REFERENCES StudentsAuth(id) ON DELETE CASCADE,
    course_id INT FOREIGN KEY REFERENCES Courses(id) ON DELETE CASCADE,
    CONSTRAINT UQ_Student_Course UNIQUE(student_id, course_id)
);

-- Insert Dummy CS Courses
INSERT INTO Courses (name, icon, tutor, description, progress, hours) VALUES 
('Data Structures', '🌳', 'Dr. Turing', 'Arrays, Trees, Graphs, and Hash Tables.', 0, 0.0),
('Algorithms', '⚙️', 'Prof. Dijkstra', 'Sorting, Searching, and Dynamic Programming.', 0, 0.0),
('Database Systems', '💾', 'Dr. Codd', 'SQL, Normalization, and Transactions.', 0, 0.0),
('Web Development', '🌐', 'Ms. Lovelace', 'React, FastAPI, and Full Stack Architecture.', 0, 0.0);

Select * from StudentsAuth;
Select * from Courses;