This repository contains the backend code for the SiliconLeaf Task Manager App, built with Node.js, Express, and MongoDB. It provides secure API endpoints for user authentication and task management.

Features:





User Authentication: Register and login endpoints using JWT and password hashing with bcrypt.



Task CRUD: API endpoints to create, read, update, and delete tasks for authenticated users.



Middleware: JWT verification to secure task-related routes.



Database: MongoDB for storing user and task data.



Optional Enhancements (if implemented): Role-based access control (admin/user) and deployment on platforms like Render or Railway.

Tech Stack:





Node.js



Express



MongoDB with Mongoose



JWT for authentication



Bcrypt for password hashing

Setup Instructions:





Clone the repository: git clone https://github.com/avinashs1ngh/siliconLeaf-server.git



Install dependencies: npm install



Configure environment variables (e.g., MongoDB URI, JWT secret).



Run the server: npm start

Note: This server works in conjunction with the siliconLeaf-client repository to provide a complete task management solution.
