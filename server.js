// Sankalp - Insurance Management System Backend
// server.js

// Import required modules
const express = require('express');
const mysql = require('mysql2'); // Use a MySQL driver
const cors = require('cors'); // To handle cross-origin requests from frontend

// --- Configuration ---
const PORT = process.env.PORT || 3000;
const DB_CONFIG = {
    host: 'localhost',
    user: 'your_db_user', // Replace with your database username
    password: 'your_db_password', // Replace with your database password
    database: 'sankalp_db' // Replace with your database name
};

// --- Initialization ---
const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// --- Database Connection ---
// In a production app, use a connection pool for better performance
const db = mysql.createConnection(DB_CONFIG);

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Successfully connected to the MySQL database.');
});

// --- API Routes ---

// 1. User Authentication
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // --- !! SECURITY WARNING !! ---
    // In a real application, you MUST hash passwords. Never store plain text passwords.
    // Use libraries like 'bcrypt' to hash and compare passwords.
    
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?'; // Simplified for demo
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Login query error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (results.length > 0) {
            // Successful login
            const user = results[0];
            // Don't send the password back to the client
            delete user.password; 
            res.json({ message: 'Login successful', user });
        } else {
            // Failed login
            res.status(401).json({ message: 'Invalid email or password' });
        }
    });
});

// 2. Get Policies for a Specific User
app.get('/api/users/:userId/policies', (req, res) => {
    const { userId } = req.params;

    const query = `
        SELECT p.*, it.type_name, it.icon
        FROM user_policies up
        JOIN policies p ON up.policy_id = p.id
        JOIN insurance_types it ON p.insurance_type_id = it.id
        WHERE up.user_id = ?;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Get policies query error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
});

// 3. Get all available insurance product types
app.get('/api/products', (req, res) => {
    const query = 'SELECT * FROM insurance_types;';
    db.query(query, (err, results) => {
         if (err) {
            console.error('Get products query error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
});


// --- Server Start ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

