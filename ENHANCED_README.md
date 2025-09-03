# 🚀 Sankalp - Enhanced Insurance Management System

A comprehensive, modern insurance management system built with Node.js, Express, MySQL, and modern frontend technologies.

## ✨ Enhanced Features

### 🔐 **Authentication & Security**
- JWT-based authentication with secure token management
- Password hashing using bcrypt
- Input validation and sanitization
- Rate limiting to prevent abuse
- Helmet.js for security headers

### 🏠 **User Management**
- User registration and login
- Profile management
- Password reset functionality
- User verification system

### 📋 **Insurance Management**
- Multiple insurance types (Health, Life, Vehicle, Property, Travel, Business)
- Policy purchase and management
- Premium tracking and renewal reminders
- Policy status monitoring

### 🚨 **Claims System**
- File and track insurance claims
- Document upload support (images, PDFs, documents)
- Claim status tracking
- Automated claim number generation

### 💰 **Payment & Billing**
- Premium payment tracking
- Multiple payment methods
- Late fee calculations
- Payment history

### 📱 **Notifications**
- Real-time notifications
- Premium due reminders
- Policy renewal alerts
- Claim status updates

### 🎫 **Support System**
- Support ticket creation
- Priority-based ticket management
- Ticket tracking and responses
- Customer service integration

### 📊 **Dashboard & Analytics**
- Modern, responsive UI
- Real-time data updates
- Interactive charts and graphs
- Mobile-friendly design

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File uploads
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **Rate Limiting** - API protection

### Frontend
- **HTML5** - Structure
- **Tailwind CSS** - Styling
- **Vanilla JavaScript** - Interactivity
- **Phosphor Icons** - Icon library
- **Responsive Design** - Mobile-first approach

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd sankalp-insurance-management
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit .env with your database credentials
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=sankalp_db
JWT_SECRET=your_super_secret_key_here
```

### 4. Database Setup
```bash
# Run the setup script
npm run setup

# Or manually run the enhanced schema
mysql -u your_username -p < enhanced_schema.sql
```

### 5. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### 6. Access the Application
- **Backend API**: http://localhost:3000
- **Frontend**: Open `enhanced_index.html` in your browser
- **Health Check**: http://localhost:3000/api/health

## 📋 Test Credentials

After running the setup script, you can use these test accounts:

### Regular User
- **Email**: testuser@sankalp.com
- **Password**: password123

### Admin User
- **Email**: admin@sankalp.com
- **Password**: admin123

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### User Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Policies
- `GET /api/policies` - Get user policies
- `POST /api/policies/purchase` - Purchase new policy

### Claims
- `GET /api/claims` - Get user claims
- `POST /api/claims` - File new claim

### Products
- `GET /api/products` - Get available insurance products
- `GET /api/products/:id/policies` - Get policies by type

### Support
- `GET /api/support` - Get support tickets
- `POST /api/support` - Create support ticket

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

## 🗄️ Database Schema

The enhanced system includes these main tables:

- **users** - User accounts and profiles
- **insurance_types** - Available insurance categories
- **policies** - Insurance policy definitions
- **user_policies** - User-policy relationships
- **claims** - Insurance claims
- **claim_documents** - Claim-related documents
- **notifications** - User notifications
- **payments** - Payment records
- **support_tickets** - Support requests
- **ticket_responses** - Support ticket responses

## 🔧 Configuration Options

### Environment Variables
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 3306)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name (default: sankalp_db)
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - Token expiration (default: 24h)
- `PORT` - Server port (default: 3000)
- `RATE_LIMIT_MAX_REQUESTS` - Rate limit (default: 100 per 15min)
- `MAX_FILE_SIZE` - Max file upload size (default: 5MB)

### Security Features
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Sanitizes all user inputs
- **Password Hashing**: Secure password storage
- **JWT Tokens**: Stateless authentication
- **CORS Protection**: Cross-origin request handling
- **Security Headers**: Helmet.js protection

## 📱 Frontend Features

### Modern UI Components
- **Responsive Design**: Works on all devices
- **Tab-based Navigation**: Easy section switching
- **Real-time Updates**: Live data synchronization
- **Form Validation**: Client-side input validation
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during operations

### Interactive Elements
- **Policy Cards**: Visual policy representation
- **Claim Forms**: Easy claim submission
- **Product Catalog**: Browse insurance options
- **Support System**: Integrated help desk
- **Notification Center**: Stay updated

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
```bash
npm start
```

### Docker (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### API Testing
Use tools like Postman or curl to test the API endpoints:

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@sankalp.com","password":"password123"}'
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL service is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Port Already in Use**
   - Change port in `.env` file
   - Kill process using port 3000

3. **JWT Token Issues**
   - Check JWT_SECRET in `.env`
   - Verify token expiration settings

4. **File Upload Fails**
   - Check upload directory permissions
   - Verify file size limits
   - Check file type restrictions

### Logs
Check console output for detailed error messages and debugging information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🎯 Roadmap

### Future Enhancements
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered claim processing
- [ ] Integration with payment gateways
- [ ] Multi-language support
- [ ] Advanced reporting system
- [ ] Customer portal enhancements
- [ ] API rate limiting improvements

---

**Built with ❤️ by the Sankalp Team**
