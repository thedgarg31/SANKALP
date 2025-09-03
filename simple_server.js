// Simple Sankalp Insurance Management System Backend
// This is a simplified version that works without complex dependencies

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// In-memory data storage (for demo purposes)
let users = [
    {
        id: 1,
        email: 'testuser@sankalp.com',
        password: 'password123',
        full_name: 'Test User',
        phone_number: '+91-9876543210'
    },
    {
        id: 2,
        email: 'admin@sankalp.com',
        password: 'admin123',
        full_name: 'Admin User',
        phone_number: '+91-9876543211'
    }
];

let policies = [
    {
        id: 1,
        user_id: 1,
        policy_name: 'Health Plus',
        provider_name: 'HDFC Ergo',
        coverage_amount: 500000,
        premium_amount: 12500,
        policy_number: 'HLT-987654',
        status: 'Active',
        start_date: '2023-10-16',
        end_date: '2024-10-15',
        purchased_at: '2023-10-16'
    },
    {
        id: 2,
        user_id: 1,
        policy_name: 'Car Shield',
        provider_name: 'Bajaj Allianz',
        coverage_amount: 800000,
        premium_amount: 18000,
        policy_number: 'CAR-123456',
        status: 'Active',
        start_date: '2023-12-23',
        end_date: '2024-12-22',
        purchased_at: '2023-12-23'
    }
];

let claims = [
    {
        id: 1,
        user_policy_id: 1,
        claim_number: 'CLM-001',
        claim_type: 'Health',
        claim_amount: 25000,
        description: 'Hospitalization for minor surgery',
        incident_date: '2024-01-15',
        filing_date: '2024-01-16',
        status: 'Pending'
    }
];

let products = [
    {
        id: 1,
        type_name: 'Health Insurance',
        description: 'Comprehensive health coverage with cashless hospitalization',
        icon: 'ph-first-aid-kit',
        category: 'Health'
    },
    {
        id: 2,
        type_name: 'Car Insurance',
        description: 'Complete vehicle protection with roadside assistance',
        icon: 'ph-car',
        category: 'Vehicle'
    },
    {
        id: 3,
        type_name: 'Life Insurance',
        description: 'Secure your family\'s future with life coverage',
        icon: 'ph-heartbeat',
        category: 'Life'
    },
    {
        id: 4,
        type_name: 'Home Insurance',
        description: 'Protect your home and belongings',
        icon: 'ph-house',
        category: 'Property'
    }
];

// Simple authentication middleware
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }
    
    // Extract user ID from token (simplified)
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Invalid token format' });
    }
    
    // For demo, we'll use a simple user ID extraction
    const userId = parseInt(token);
    if (isNaN(userId) || !users.find(u => u.id === userId)) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.userId = userId;
    next();
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Sankalp Insurance API is running',
        timestamp: new Date().toISOString()
    });
});

// User registration
app.post('/api/register', (req, res) => {
    const { email, password, full_name, phone_number } = req.body;
    
    if (!email || !password || !full_name) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    
    const newUser = {
        id: users.length + 1,
        email,
        password,
        full_name,
        phone_number
    };
    
    users.push(newUser);
    
    // Generate simple token (user ID)
    const token = newUser.id.toString();
    
    res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
            id: newUser.id,
            email: newUser.email,
            full_name: newUser.full_name,
            phone_number: newUser.phone_number
        }
    });
});

// User login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate simple token (user ID)
    const token = user.id.toString();
    
    res.json({
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            phone_number: user.phone_number
        }
    });
});

// Get user policies
app.get('/api/policies', authenticateUser, (req, res) => {
    const userPolicies = policies.filter(p => p.user_id === req.userId);
    res.json(userPolicies);
});

// Get user claims
app.get('/api/claims', authenticateUser, (req, res) => {
    const userClaims = claims.filter(c => {
        const policy = policies.find(p => p.id === c.user_policy_id);
        return policy && policy.user_id === req.userId;
    });
    res.json(userClaims);
});

// Get available products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// File a new claim
app.post('/api/claims', authenticateUser, (req, res) => {
    const { user_policy_id, claim_type, claim_amount, description, incident_date } = req.body;
    
    if (!user_policy_id || !claim_type || !claim_amount || !description || !incident_date) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Verify policy belongs to user
    const policy = policies.find(p => p.id === user_policy_id && p.user_id === req.userId);
    if (!policy) {
        return res.status(403).json({ message: 'Access denied to this policy' });
    }
    
    const newClaim = {
        id: claims.length + 1,
        user_policy_id,
        claim_number: `CLM-${Date.now().toString().slice(-6)}`,
        claim_type,
        claim_amount: parseFloat(claim_amount),
        description,
        incident_date,
        filing_date: new Date().toISOString().split('T')[0],
        status: 'Pending'
    };
    
    claims.push(newClaim);
    
    res.status(201).json({
        message: 'Claim filed successfully',
        claim: newClaim
    });
});

// Create support ticket
app.post('/api/support', authenticateUser, (req, res) => {
    const { subject, description, priority } = req.body;
    
    if (!subject || !description) {
        return res.status(400).json({ message: 'Subject and description required' });
    }
    
    const ticket = {
        id: Date.now(),
        user_id: req.userId,
        subject,
        description,
        priority: priority || 'Medium',
        status: 'Open',
        created_at: new Date().toISOString()
    };
    
    res.status(201).json({
        message: 'Support ticket created successfully',
        ticket
    });
});

// Get support tickets
app.get('/api/support', authenticateUser, (req, res) => {
    // For demo, return empty array
    res.json([]);
});

// Serve the enhanced frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'enhanced_index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Sankalp Insurance Server running on http://localhost:${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔌 API Health: http://localhost:${PORT}/api/health`);
    console.log(`\n📋 Test Credentials:`);
    console.log(`   User: testuser@sankalp.com / password123`);
    console.log(`   Admin: admin@sankalp.com / admin123`);
    console.log(`\n✨ Open http://localhost:${PORT} in your browser to see the enhanced system!`);
});
