// Setup script for Sankalp Insurance Management System
// This script will initialize the database and create test data

require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'your_db_user',
    password: process.env.DB_PASSWORD || 'your_db_password',
    database: process.env.DB_NAME || 'sankalp_db',
    port: process.env.DB_PORT || 3306
};

async function setupDatabase() {
    let connection;
    
    try {
        console.log('🚀 Starting Sankalp Insurance System Setup...\n');
        
        // Connect to MySQL server (without specifying database)
        connection = await mysql.createConnection({
            host: DB_CONFIG.host,
            user: DB_CONFIG.user,
            password: DB_CONFIG.password,
            port: DB_CONFIG.port
        });
        
        console.log('✅ Connected to MySQL server');
        
        // Create database if it doesn't exist
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${DB_CONFIG.database}`);
        console.log(`✅ Database '${DB_CONFIG.database}' created/verified`);
        
        // Use the database
        await connection.execute(`USE ${DB_CONFIG.database}`);
        
        // Read and execute enhanced schema
        const fs = require('fs');
        const schemaPath = './enhanced_schema.sql';
        
        if (fs.existsSync(schemaPath)) {
            console.log('📋 Executing enhanced database schema...');
            const schema = fs.readFileSync(schemaPath, 'utf8');
            
            // Split schema into individual statements
            const statements = schema
                .split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
            
            for (const statement of statements) {
                if (statement.trim()) {
                    try {
                        await connection.execute(statement);
                    } catch (error) {
                        // Skip errors for existing tables/indexes
                        if (!error.message.includes('already exists')) {
                            console.warn(`⚠️  Warning: ${error.message}`);
                        }
                    }
                }
            }
            console.log('✅ Database schema executed successfully');
        } else {
            console.log('⚠️  Enhanced schema file not found, creating basic tables...');
            await createBasicTables(connection);
        }
        
        // Create test user with hashed password
        console.log('👤 Creating test user...');
        const hashedPassword = await bcrypt.hash('password123', 12);
        
        // Check if test user exists
        const [existingUsers] = await connection.execute(
            'SELECT id FROM users WHERE email = ?',
            ['testuser@sankalp.com']
        );
        
        if (existingUsers.length === 0) {
            await connection.execute(`
                INSERT INTO users (email, password, full_name, phone_number, date_of_birth, gender, address, is_verified)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                'testuser@sankalp.com',
                hashedPassword,
                'Test User',
                '+91-9876543210',
                '1990-01-01',
                'Male',
                '123 Test Street, Test City',
                true
            ]);
            console.log('✅ Test user created: testuser@sankalp.com / password123');
        } else {
            // Update existing user's password
            await connection.execute(
                'UPDATE users SET password = ? WHERE email = ?',
                [hashedPassword, 'testuser@sankalp.com']
            );
            console.log('✅ Test user password updated: testuser@sankalp.com / password123');
        }
        
        // Create admin user
        const adminPassword = await bcrypt.hash('admin123', 12);
        const [existingAdmins] = await connection.execute(
            'SELECT id FROM users WHERE email = ?',
            ['admin@sankalp.com']
        );
        
        if (existingAdmins.length === 0) {
            await connection.execute(`
                INSERT INTO users (email, password, full_name, phone_number, date_of_birth, gender, address, is_verified)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                'admin@sankalp.com',
                adminPassword,
                'Admin User',
                '+91-9876543211',
                '1985-01-01',
                'Male',
                '456 Admin Street, Admin City',
                true
            ]);
            console.log('✅ Admin user created: admin@sankalp.com / admin123');
        } else {
            await connection.execute(
                'UPDATE users SET password = ? WHERE email = ?',
                [adminPassword, 'admin@sankalp.com']
            );
            console.log('✅ Admin user password updated: admin@sankalp.com / admin123');
        }
        
        console.log('\n🎉 Setup completed successfully!');
        console.log('\n📋 Test Credentials:');
        console.log('   User: testuser@sankalp.com / password123');
        console.log('   Admin: admin@sankalp.com / admin123');
        console.log('\n🚀 Next steps:');
        console.log('   1. Copy env.example to .env and configure your database');
        console.log('   2. Run: npm install');
        console.log('   3. Run: npm run dev');
        console.log('   4. Open enhanced_index.html in your browser');
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

async function createBasicTables(connection) {
    // Create basic tables if enhanced schema is not available
    const basicTables = [
        `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            phone_number VARCHAR(20),
            address TEXT,
            is_verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        
        `CREATE TABLE IF NOT EXISTS insurance_types (
            id INT AUTO_INCREMENT PRIMARY KEY,
            type_name VARCHAR(100) NOT NULL,
            description TEXT,
            icon VARCHAR(100),
            category VARCHAR(50),
            is_active BOOLEAN DEFAULT TRUE
        )`,
        
        `CREATE TABLE IF NOT EXISTS policies (
            id INT AUTO_INCREMENT PRIMARY KEY,
            insurance_type_id INT,
            provider_name VARCHAR(255) NOT NULL,
            policy_name VARCHAR(255) NOT NULL,
            coverage_amount DECIMAL(15, 2) NOT NULL,
            annual_premium DECIMAL(10, 2) NOT NULL,
            details TEXT,
            is_active BOOLEAN DEFAULT TRUE
        )`,
        
        `CREATE TABLE IF NOT EXISTS user_policies (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            policy_id INT NOT NULL,
            policy_number VARCHAR(100) NOT NULL UNIQUE,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            status ENUM('Active', 'Expired', 'Cancelled') DEFAULT 'Active',
            premium_amount DECIMAL(10, 2) NOT NULL,
            purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    ];
    
    for (const table of basicTables) {
        await connection.execute(table);
    }
    
    // Insert sample data
    await connection.execute(`
        INSERT IGNORE INTO insurance_types (type_name, description, icon, category) VALUES
        ('Health Insurance', 'Comprehensive health coverage', 'ph-first-aid-kit', 'Health'),
        ('Car Insurance', 'Vehicle protection', 'ph-car', 'Vehicle'),
        ('Life Insurance', 'Life protection', 'ph-heartbeat', 'Life')
    `);
    
    await connection.execute(`
        INSERT IGNORE INTO policies (insurance_type_id, provider_name, policy_name, coverage_amount, annual_premium) VALUES
        (1, 'HDFC Ergo', 'Health Plus', 500000.00, 12000.00),
        (2, 'Bajaj Allianz', 'Car Shield', 800000.00, 18000.00)
    `);
}

// Run setup if this file is executed directly
if (require.main === module) {
    setupDatabase().catch(console.error);
}

module.exports = { setupDatabase };
