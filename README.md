# SANKALP

Sankalp - Insurance Management System
This project contains the foundational code for a full-stack insurance management web application.

Files Included
index.html: The complete frontend of the application. It's a single, responsive file built with HTML and Tailwind CSS. It includes the logic for the login page and the main user dashboard.

server.js: A starter backend server using Node.js and Express. It defines the basic API endpoints needed to connect the frontend to a database.

schema.sql: The SQL script to create and structure your database (sankalp_db). It defines all the necessary tables and relationships.

README.md: This setup guide.

Setup Instructions
1. Frontend
No special setup is needed.

Simply open the index.html file in any modern web browser (like Chrome, Firefox, or Edge) to see the user interface.

2. Database
You need a MySQL server installed and running on your machine.

Open your MySQL client (like MySQL Workbench, DBeaver, or the command line).

Create a new database named sankalp_db.

Run the entire script from schema.sql within this database. This will create all the tables and insert some sample data for testing.

3. Backend
You need to have Node.js and npm installed on your computer.

Open a terminal or command prompt in the project's root directory.

Install dependencies by running this command:

npm install express mysql2 cors

Configure the database connection:

Open the server.js file.

Find the DB_CONFIG object near the top.

Replace 'your_db_user' and 'your_db_password' with your actual MySQL username and password.

Run the server with the command:

node server.js

The terminal should display "Server is running on http://localhost:3000". Your backend is now live and ready to receive requests from the frontend.

Next Steps
To make this a fully functional application, you will need to:

Connect Frontend to Backend: Modify the index.html JavaScript to use the fetch() API to call your backend endpoints (e.g., /api/login, /api/users/:userId/policies) instead of using dummy data.

Implement Password Hashing: It's crucial for security. Use a library like bcrypt in server.js to securely hash user passwords before storing them and to compare them during login.

Build Out Features: Expand the backend with more routes for adding/updating policies, managing user profiles, etc.

Deployment: Once fully developed, you can deploy the frontend to a static hosting service and the backend to a cloud platform like Heroku, Vercel, or AWS.
