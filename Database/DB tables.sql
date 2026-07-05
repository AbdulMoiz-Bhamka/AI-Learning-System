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


Select * from StudentsAuth;