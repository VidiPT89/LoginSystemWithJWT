# 🔐 Login System JWT

A modern, elegant and secure authentication system with JSON Web Tokens (JWT), built with Express.js, PostgreSQL, bcrypt and Nodemailer.

Login System JWT is a professional-grade authentication backend that demonstrates modern security practices, clean architecture and best practices in Node.js development. Features a beautiful splash screen, bilingual support (PT/EN), animated glassmorphism interface and comprehensive API documentation.

---

## ✨ Main Features

- 📝 **User Registration** — Complete user registration with validation and email confirmation
- 🔑 **Secure Login** — Password authentication with bcrypt hashing (10 rounds)
- 🎫 **JWT Authentication** — Access tokens (15m) + Refresh tokens (7d) for secure, stateless auth
- 🛡️ **Protected Routes** — Middleware-based route protection with token verification
- 🔄 **Token Refresh** — Seamless token renewal without re-authentication
- 📧 **Password Reset** — Secure password recovery via email with time-limited tokens
- 👤 **User Profile** — Protected endpoint to retrieve authenticated user data
- 🌍 **Bilingual Interface** — One-click toggle between Portuguese and English
- 🎨 **Glassmorphism UI** — Modern animated interface with smooth transitions
- 🎬 **Splash Screen** — Elegant intro screen with creator information and links
- 🔒 **Security Headers** — Helmet.js for HTTP security + CORS configuration
- 📊 **Database Indexes** — Optimized PostgreSQL queries with proper indexing
- ⚙️ **Environment Configuration** — Dotenv for secure configuration management

---

## 🛠️ Technologies

<div align="center">

[![Express.js](https://img.shields.io/badge/Express.js-4.18.2-000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-336791?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-9.0.0-000?style=flat&logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![bcryptjs](https://img.shields.io/badge/bcryptjs-2.4.3-FF6B00?style=flat&logo=npm&logoColor=white)](https://www.npmjs.com/package/bcryptjs)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-6.9.0-46C3D6?style=flat&logo=npm&logoColor=white)](https://nodemailer.com/)

</div>

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Backend Framework** | Express.js 4.18.2 | Lightweight, fast web server |
| **Database** | PostgreSQL 12+ | Reliable relational database |
| **Authentication** | JWT 9.0.0 | Stateless token-based auth |
| **Password Security** | bcryptjs 2.4.3 | Industry-standard password hashing |
| **Email Service** | Nodemailer 6.9.0 | Email notifications and password reset |
| **Security** | Helmet 7.0.0 | HTTP security headers |
| **CORS** | cors 2.8.5 | Cross-origin resource sharing |
| **Config** | dotenv 16.0.3 | Environment variable management |

---

## 🧱 Project Structure

```
LoginSystemWithJWT/
├── src/
│   ├── controllers/
│   │   └── authController.js          # Authentication logic (register, login, reset)
│   ├── db/
│   │   ├── config.js                  # PostgreSQL connection pool
│   │   └── migrations.js              # Database schema initialization
│   ├── middleware/
│   │   └── auth.js                    # JWT verification and token refresh
│   ├── models/
│   │   └── User.js                    # User model with bcrypt integration
│   ├── routes/
│   │   └── auth.js                    # Authentication endpoints
│   ├── services/
│   │   └── emailService.js            # Email sending service (Nodemailer)
│   ├── utils/
│   │   └── generateTokens.js          # JWT token generation utilities
│   └── server.js                      # Express server entry point
├── index.html                         # Beautiful UI with bilingual support
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore rules
├── package.json                       # Dependencies and scripts
├── LICENSE                            # MIT License
├── GITHUB_CONFIG.md                   # GitHub repository configuration guide
└── README.md                          # This file

```

---

## ▶️ How to Run

### Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn** (included with Node.js)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/VidiPT89/LoginSystemWithJWT.git
cd LoginSystemWithJWT
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create PostgreSQL database:**

```bash
psql -U postgres
CREATE DATABASE login_system;
\q
```

4. **Configure environment variables:**

```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials and JWT secrets
nano .env
```

5. **Initialize database:**

```bash
npm run migrate
```

6. **Start development server:**

```bash
npm run dev
```

The API will be available at `http://localhost:3000`  
The UI will be available at `http://localhost:3000/index.html`

---

## 📦 Available Scripts

- **`npm run dev`** — Start development server with auto-reload (nodemon)
- **`npm start`** — Start production server
- **`npm run migrate`** — Initialize database and create tables

---

## 🔌 API Endpoints

### Public Endpoints (No Authentication Required)

#### **Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "SecurePassword123",
  "passwordConfirm": "SecurePassword123"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully! ✅",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "is_verified": false,
    "created_at": "2026-08-05T10:30:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### **Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response:** `200 OK` (same as register)

#### **Refresh Token**
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "message": "Token updated successfully!",
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### **Request Password Reset**
```http
POST /api/auth/request-password-reset
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### **Reset Password**
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "NewPassword123",
  "passwordConfirm": "NewPassword123"
}
```

### Protected Endpoints (Require JWT Token)

#### **Get User Profile**
```http
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:** `200 OK`
```json
{
  "message": "Profile loaded successfully!",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "is_verified": false,
    "created_at": "2026-08-05T10:30:00Z"
  }
}
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test123!",
    "passwordConfirm": "Test123!"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# Get Profile (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

Import the API collection from `CURL_EXAMPLES.txt` or `EXAMPLES.md`

### Using VS Code REST Client

Install the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension and use the examples in `CURL_EXAMPLES.txt`

---

## 🔐 Security Features

- **Bcrypt Password Hashing** — 10 rounds for strong, resistant hashing
- **JWT Tokens** — Stateless authentication with short-lived access tokens
- **Token Refresh** — Secure token rotation without re-authentication
- **Environment Variables** — Sensitive data stored securely in `.env`
- **Password Reset Tokens** — Time-limited reset tokens (1 hour expiry)
- **HTTP Security Headers** — Helmet.js for XSS, CSRF and clickjacking protection
- **CORS Configuration** — Controlled cross-origin access
- **Input Validation** — All endpoints validate input data
- **Error Handling** — Secure error messages (no sensitive data leakage)
- **Database Indexes** — Optimized queries on email and username

---

## 🌍 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=login_system
DB_USER=postgres
DB_PASSWORD=your_secure_password

# JWT Configuration (Change in production!)
JWT_SECRET=your_super_secret_key_here_change_in_production
JWT_REFRESH_SECRET=your_refresh_secret_key_change_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Service (Gmail SMTP)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_from_google
EMAIL_FROM=noreply@yourapp.com

# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Email Configuration (Gmail)

1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password: [Google Account Security](https://myaccount.google.com/apppasswords)
3. Use the generated password in `.env` as `EMAIL_PASSWORD`

---

## 📊 Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

---

## 🎯 Frontend Integration

The `index.html` file includes:

- **Bilingual Support** — Portuguese (PT) and English (EN)
- **Splash Screen** — Beautiful intro with creator information
- **Glassmorphism UI** — Modern animated interface
- **Responsive Design** — Mobile to desktop
- **Creator Credits** — Links to portfolio and GitHub

**Customization:**

```javascript
// Change language
setLanguage('en');  // or 'pt'

// Access current language
console.log(currentLanguage);

// Add more translations in the `translations` object
```

---

## 🧩 Project Highlights

This project demonstrates:

- **Clean Architecture** — Separation of concerns (controllers, models, services)
- **Security Best Practices** — Bcrypt hashing, JWT tokens, input validation
- **RESTful API Design** — Proper HTTP methods and status codes
- **Database Optimization** — Indexes and connection pooling
- **Error Handling** — Comprehensive error handling with meaningful messages
- **Configuration Management** — Environment-based configuration
- **Code Organization** — Logical folder structure and naming conventions
- **Modern JavaScript** — ES6+ syntax, async/await, arrow functions
- **Bilingual Support** — i18n with localStorage persistence
- **Professional UI** — Animated glassmorphism with modern aesthetics

---

## 🚀 Production Deployment

Before deploying:

1. **Generate Strong Secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. **Set Environment Variables:**
   - Update `.env` with production values
   - Use a secrets manager (AWS Secrets Manager, GitHub Secrets, etc.)

3. **Database:**
   - Set up backups
   - Use production-grade PostgreSQL instance
   - Configure SSL connections

4. **Security Enhancements:**
   - Install `express-rate-limit` for rate limiting
   - Enable HTTPS/SSL
   - Configure CORS for your domain
   - Set up firewall rules

5. **Monitoring:**
   - Enable logging
   - Set up error tracking (Sentry, LogRocket)
   - Monitor database performance

---

## 📚 Code Examples

### Frontend Integration (JavaScript)

```javascript
// Register user
async function register() {
  const response = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@example.com',
      username: 'john_doe',
      password: 'Secure123!',
      passwordConfirm: 'Secure123!'
    })
  });

  const data = await response.json();
  localStorage.setItem('accessToken', data.tokens.accessToken);
  localStorage.setItem('refreshToken', data.tokens.refreshToken);
}

// Access protected endpoint
async function getProfile() {
  const token = localStorage.getItem('accessToken');
  const response = await fetch('http://localhost:3000/api/auth/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  return await response.json();
}
```

See `EXAMPLES.md` for more detailed code examples.

---

## 🐛 Troubleshooting

### PostgreSQL Connection Error
```bash
# macOS
brew services start postgresql

# Linux
sudo service postgresql start

# Windows
# Open Services and start PostgreSQL
```

### Port 3000 Already in Use
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>

# Or change port in .env
PORT=3001
```

### Database Does Not Exist
```bash
psql -U postgres
CREATE DATABASE login_system;
\q
npm run migrate
```

### Email Not Sending
- Verify Gmail App Password in `.env`
- Check 2FA is enabled on Google Account
- Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are correct
- Try with a test email from settings page

---

## 📄 License

This project is licensed under the **MIT License**.

See [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

Developed by **David Arsénio Martins**  
🌐 [ividi.dev](https://ividi.dev/)  
💻 [github.com/VidiPT89](https://github.com/VidiPT89/)  
💼 [LinkedIn](https://www.linkedin.com/in/david-martins-9b0129270/)

---

**Built with ❤️ using Node.js, Express.js and PostgreSQL**
