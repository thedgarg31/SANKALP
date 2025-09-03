# 🚀 Sankalp Insurance Management System

> **A modern, comprehensive insurance management platform with beautiful UI and full-stack functionality**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-blue.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ **Features**

### 🎨 **Modern UI/UX**
- **Gradient Design** - Beautiful blue-to-indigo gradients throughout
- **Interactive Charts** - Real-time data visualization with Chart.js
- **Responsive Layout** - Mobile-first design that works on all devices
- **Smooth Animations** - Hover effects and transitions for better user experience
- **Modern Icons** - Phosphor icons for consistent visual hierarchy

### 📊 **Dashboard & Analytics**
- **Overview Dashboard** - Statistics cards with real-time data
- **Policy Distribution Charts** - Visual representation of insurance portfolio
- **Premium Trends** - Track premium payments over time
- **Recent Activities** - Live feed of user actions and system updates
- **Notification System** - Real-time alerts and updates

### 🔐 **User Management**
- **User Registration & Login** - Secure authentication system
- **Profile Management** - User information and preferences
- **Role-based Access** - Different permissions for users and admins
- **Session Management** - Secure token-based authentication

### 🛡️ **Insurance Management**
- **Policy Management** - Create, view, and manage insurance policies
- **Claims Processing** - File and track insurance claims
- **Product Catalog** - Browse available insurance products
- **Coverage Tracking** - Monitor policy coverage and expiration dates
- **Premium Management** - Track payments and due dates

### 🎫 **Support System**
- **Ticket Creation** - Submit support requests with priority levels
- **Issue Tracking** - Monitor ticket status and resolution
- **Priority Management** - Set and manage support ticket priorities
- **Response System** - Track support team responses

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 16+ 
- npm or yarn

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sankalp-insurance.git
   cd sankalp-insurance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### **Test Credentials**
- **User:** `testuser@sankalp.com` / `password123`
- **Admin:** `admin@sankalp.com` / `admin123`

## 🏗️ **Project Structure**

```
sankalp-insurance/
├── enhanced_index.html      # Enhanced frontend with modern UI
├── simple_server.js         # Simplified backend server
├── enhanced_server.js       # Full-featured backend (optional)
├── package.json            # Project dependencies and scripts
├── env.example             # Environment configuration template
├── enhanced_schema.sql     # Database schema for full system
├── schema.sql              # Basic database schema
├── setup.js               # Database setup script
├── QUICK_START.md         # Quick start guide
└── README.md              # This file
```

## 🎨 **UI Components**

### **Color Scheme**
- **Primary:** Blue to Indigo gradients (`from-blue-600 to-indigo-600`)
- **Success:** Green gradients (`from-green-500 to-green-600`)
- **Warning:** Yellow gradients (`from-yellow-500 to-yellow-600`)
- **Danger:** Red to Pink gradients (`from-red-600 to-pink-600`)

### **Typography**
- **Font Family:** Inter (Google Fonts)
- **Weights:** 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Responsive:** Scales appropriately across all device sizes

### **Layout System**
- **Grid:** Responsive grid layouts using Tailwind CSS
- **Spacing:** Consistent 6-unit spacing system
- **Borders:** Rounded corners (xl, 2xl) for modern look
- **Shadows:** Multiple shadow levels for depth and hierarchy

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/register` - User registration
- `POST /api/login` - User login

### **Policies**
- `GET /api/policies` - Get user policies
- `POST /api/policies` - Create new policy

### **Claims**
- `GET /api/claims` - Get user claims
- `POST /api/claims` - File new claim

### **Products**
- `GET /api/products` - Get available insurance products

### **Support**
- `GET /api/support` - Get support tickets
- `POST /api/support` - Create support ticket

### **Health Check**
- `GET /api/health` - API status and information

## 🛠️ **Technology Stack**

### **Frontend**
- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework
- **Vanilla JavaScript** - Modern ES6+ features
- **Chart.js** - Interactive data visualization
- **Phosphor Icons** - Beautiful icon library

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **CORS** - Cross-origin resource sharing
- **In-memory Storage** - Demo data storage

### **Development Tools**
- **npm** - Package manager
- **nodemon** - Development server with auto-reload

## 📱 **Responsive Design**

The system is built with a mobile-first approach:
- **Touch-friendly** buttons and forms
- **Optimized layouts** for small screens
- **Readable text** at all sizes
- **Smooth scrolling** and navigation
- **Responsive grids** that adapt to screen size

## 🎯 **Features in Detail**

### **1. Dashboard Overview**
- **Statistics Cards:** Active policies, total coverage, pending claims, next premium
- **Interactive Charts:** Policy distribution (doughnut chart) and premium trends (bar chart)
- **Recent Activities:** Live feed showing latest user actions and system updates
- **Quick Actions:** Easy access to common tasks

### **2. Policy Management**
- **Policy Cards:** Detailed information with status indicators
- **Coverage Details:** Amount, premium, dates, and provider information
- **Status Tracking:** Active, expired, and pending policy states
- **Quick Actions:** View details and manage policies

### **3. Claims System**
- **Claim Forms:** Comprehensive forms for filing new claims
- **Status Tracking:** Pending, approved, rejected, and processed states
- **Document Management:** Upload and manage claim documents
- **History View:** Complete claim history and timeline

### **4. Product Catalog**
- **Insurance Types:** Health, Life, Vehicle, Property, and more
- **Product Details:** Comprehensive descriptions and features
- **Visual Icons:** Category-specific icons for easy identification
- **Learn More:** Detailed product information and benefits

### **5. Support System**
- **Ticket Creation:** Easy-to-use forms for support requests
- **Priority Levels:** Low, Medium, High, and Critical priorities
- **Status Tracking:** Open, in-progress, and resolved states
- **Response Management:** Track support team responses

## 🚀 **Deployment**

### **Local Development**
```bash
npm run dev
```

### **Production**
```bash
npm start
```

### **Environment Variables**
Copy `env.example` to `.env` and configure:
- Database credentials
- JWT secrets
- Server ports
- Email settings

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Tailwind CSS** for the amazing utility-first CSS framework
- **Chart.js** for beautiful data visualization
- **Phosphor Icons** for the comprehensive icon library
- **Express.js** for the robust web framework

## 📞 **Support**

- **Documentation:** [QUICK_START.md](QUICK_START.md)
- **Issues:** [GitHub Issues](https://github.com/yourusername/sankalp-insurance/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/sankalp-insurance/discussions)

---

## 🎉 **Get Started Today!**

Ready to experience the future of insurance management? 

```bash
git clone https://github.com/yourusername/sankalp-insurance.git
cd sankalp-insurance
npm install
npm start
```

**Open `http://localhost:3000` and start exploring the enhanced system!**

---

<div align="center">
  <p>Made with ❤️ by the Sankalp Team</p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>
