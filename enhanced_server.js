// Enhanced Sankalp - Insurance Management System Backend
// enhanced_server.js

require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration
const PORT = process.env.PORT || 3000;
const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'your_db_user',
    password: process.env.DB_PASSWORD || 'your_db_password',
    database: process.env.DB_NAME || 'sankalp_db',
    port: process.env.DB_PORT || 3306
};

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = process.env.UPLOAD_PATH || './uploads';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image, PDF and document files are allowed!'));
        }
    }
});

// Database connection pool
let pool;

async function initializeDatabase() {
    try {
        pool = mysql.createPool({
            ...DB_CONFIG,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        
        // Test connection
        const connection = await pool.getConnection();
        console.log('Successfully connected to the MySQL database.');
        connection.release();
    } catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
}

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Validation middleware
const validateRegistration = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('full_name').trim().isLength({ min: 2 }),
    body('phone_number').optional().isMobilePhone()
];

const validateLogin = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
];

// Utility functions
const generatePolicyNumber = (type) => {
    const prefix = type.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
};

const generateClaimNumber = () => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CLM-${timestamp}-${random}`;
};

// API Routes

// 1. User Registration
app.post('/api/register', validateRegistration, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, full_name, phone_number, date_of_birth, gender, address } = req.body;

        // Check if user already exists
        const [existingUsers] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insert new user
        const [result] = await pool.execute(
            'INSERT INTO users (email, password, full_name, phone_number, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [email, hashedPassword, full_name, phone_number, date_of_birth, gender, address]
        );

        // Generate JWT token
        const token = jwt.sign(
            { userId: result.insertId, email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.insertId,
                email,
                full_name,
                phone_number,
                date_of_birth,
                gender,
                address
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 2. User Login
app.post('/api/login', validateLogin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Get user from database
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ? AND status = "Active"',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Update last login
        await pool.execute(
            'UPDATE users SET last_login = NOW() WHERE id = ?',
            [user.id]
        );

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Remove password from response
        delete user.password;

        res.json({
            message: 'Login successful',
            token,
            user
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 3. Get User Profile
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const [users] = await pool.execute(
            'SELECT id, email, full_name, phone_number, date_of_birth, gender, address, profile_picture, created_at FROM users WHERE id = ?',
            [req.user.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 4. Update User Profile
app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
        const { full_name, phone_number, address, date_of_birth, gender } = req.body;

        await pool.execute(
            'UPDATE users SET full_name = ?, phone_number = ?, address = ?, date_of_birth = ?, gender = ?, updated_at = NOW() WHERE id = ?',
            [full_name, phone_number, address, date_of_birth, gender, req.user.userId]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 5. Get User Policies
app.get('/api/policies', authenticateToken, async (req, res) => {
    try {
        const [policies] = await pool.execute(`
            SELECT up.*, p.provider_name, p.policy_name, p.coverage_amount, p.details,
                   it.type_name, it.icon, it.category
            FROM user_policies up
            JOIN policies p ON up.policy_id = p.id
            JOIN insurance_types it ON p.insurance_type_id = it.id
            WHERE up.user_id = ?
            ORDER BY up.purchased_at DESC
        `, [req.user.userId]);

        res.json(policies);
    } catch (error) {
        console.error('Get policies error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 6. Get Available Insurance Products
app.get('/api/products', async (req, res) => {
    try {
        const [products] = await pool.execute(`
            SELECT it.*, COUNT(p.id) as policy_count
            FROM insurance_types it
            LEFT JOIN policies p ON it.id = p.insurance_type_id AND p.is_active = 1
            WHERE it.is_active = 1
            GROUP BY it.id
            ORDER BY it.type_name
        `);

        res.json(products);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 7. Get Policies by Type
app.get('/api/products/:typeId/policies', async (req, res) => {
    try {
        const { typeId } = req.params;
        const [policies] = await pool.execute(`
            SELECT * FROM policies 
            WHERE insurance_type_id = ? AND is_active = 1
            ORDER BY annual_premium ASC
        `, [typeId]);

        res.json(policies);
    } catch (error) {
        console.error('Get policies by type error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 8. Purchase Policy
app.post('/api/policies/purchase', authenticateToken, async (req, res) => {
    try {
        const { policy_id, start_date, end_date, premium_amount, payment_frequency } = req.body;

        // Validate dates
        const start = new Date(start_date);
        const end = new Date(end_date);
        if (start >= end) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        // Calculate next premium date
        let nextPremiumDate = new Date(start);
        switch (payment_frequency) {
            case 'Monthly':
                nextPremiumDate.setMonth(nextPremiumDate.getMonth() + 1);
                break;
            case 'Quarterly':
                nextPremiumDate.setMonth(nextPremiumDate.getMonth() + 3);
                break;
            case 'Half-Yearly':
                nextPremiumDate.setMonth(nextPremiumDate.getMonth() + 6);
                break;
            case 'Yearly':
                nextPremiumDate.setFullYear(nextPremiumDate.getFullYear() + 1);
                break;
        }

        // Generate policy number
        const policyNumber = generatePolicyNumber('POL');

        // Insert user policy
        const [result] = await pool.execute(`
            INSERT INTO user_policies (user_id, policy_id, policy_number, start_date, end_date, 
                                    premium_amount, payment_frequency, next_premium_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [req.user.userId, policy_id, policyNumber, start_date, end_date, 
             premium_amount, payment_frequency, nextPremiumDate.toISOString().split('T')[0]]);

        res.status(201).json({
            message: 'Policy purchased successfully',
            policy_number: policyNumber,
            id: result.insertId
        });

    } catch (error) {
        console.error('Purchase policy error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 9. File Claims
app.post('/api/claims', authenticateToken, upload.array('documents', 5), async (req, res) => {
    try {
        const { user_policy_id, claim_type, claim_amount, description, incident_date } = req.body;

        // Validate user policy ownership
        const [userPolicies] = await pool.execute(
            'SELECT id FROM user_policies WHERE id = ? AND user_id = ?',
            [user_policy_id, req.user.userId]
        );

        if (userPolicies.length === 0) {
            return res.status(403).json({ message: 'Access denied to this policy' });
        }

        // Generate claim number
        const claimNumber = generateClaimNumber();

        // Insert claim
        const [result] = await pool.execute(`
            INSERT INTO claims (user_policy_id, claim_number, claim_type, claim_amount, 
                              description, incident_date)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [user_policy_id, claimNumber, claim_type, claim_amount, description, incident_date]);

        const claimId = result.insertId;

        // Handle document uploads
        if (req.files && req.files.length > 0) {
            const documentValues = req.files.map(file => [
                claimId,
                file.originalname,
                file.path,
                path.extname(file.originalname).substring(1)
            ]);

            await pool.execute(`
                INSERT INTO claim_documents (claim_id, document_name, document_path, document_type)
                VALUES ?
            `, [documentValues]);
        }

        res.status(201).json({
            message: 'Claim filed successfully',
            claim_number: claimNumber,
            id: claimId
        });

    } catch (error) {
        console.error('File claim error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 10. Get User Claims
app.get('/api/claims', authenticateToken, async (req, res) => {
    try {
        const [claims] = await pool.execute(`
            SELECT c.*, up.policy_number, p.policy_name, it.type_name
            FROM claims c
            JOIN user_policies up ON c.user_policy_id = up.id
            JOIN policies p ON up.policy_id = p.id
            JOIN insurance_types it ON p.insurance_type_id = it.id
            WHERE up.user_id = ?
            ORDER BY c.filing_date DESC
        `, [req.user.userId]);

        res.json(claims);
    } catch (error) {
        console.error('Get claims error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 11. Get Notifications
app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const [notifications] = await pool.execute(`
            SELECT * FROM notifications 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 50
        `, [req.user.userId]);

        res.json(notifications);
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 12. Mark Notification as Read
app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        await pool.execute(`
            UPDATE notifications 
            SET is_read = 1 
            WHERE id = ? AND user_id = ?
        `, [id, req.user.userId]);

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 13. Create Support Ticket
app.post('/api/support', authenticateToken, async (req, res) => {
    try {
        const { subject, description, priority } = req.body;

        const ticketNumber = `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const [result] = await pool.execute(`
            INSERT INTO support_tickets (user_id, ticket_number, subject, description, priority)
            VALUES (?, ?, ?, ?, ?)
        `, [req.user.userId, ticketNumber, subject, description, priority]);

        res.status(201).json({
            message: 'Support ticket created successfully',
            ticket_number: ticketNumber,
            id: result.insertId
        });

    } catch (error) {
        console.error('Create support ticket error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 14. Get Support Tickets
app.get('/api/support', authenticateToken, async (req, res) => {
    try {
        const [tickets] = await pool.execute(`
            SELECT * FROM support_tickets 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        `, [req.user.userId]);

        res.json(tickets);
    } catch (error) {
        console.error('Get support tickets error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 15. Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Initialize and start server
async function startServer() {
    await initializeDatabase();
    
    app.listen(PORT, () => {
        console.log(`🚀 Enhanced Sankalp Server is running on http://localhost:${PORT}`);
        console.log(`📊 Database: ${DB_CONFIG.database} on ${DB_CONFIG.host}:${DB_CONFIG.port}`);
        console.log(`🔐 JWT Secret: ${JWT_SECRET.substring(0, 10)}...`);
        console.log(`⏱️  Rate Limit: ${process.env.RATE_LIMIT_MAX_REQUESTS || 100} requests per 15 minutes`);
    });
}

startServer().catch(console.error);

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    if (pool) {
        pool.end();
    }
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    if (pool) {
        pool.end();
    }
    process.exit(0);
});
