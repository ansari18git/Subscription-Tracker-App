📬 Subscription Management System
A full-stack production-grade web application for managing subscriptions — built with the MERN stack (MongoDB, Express, React, Node.js) — featuring secure authentication, smart rate limiting, email reminders, and protection against bots.

## 🌍 Live Demo
https://subscription-tracker-app-pi.vercel.app/

🔧 Tech Stack
Frontend: React.js, Bootstrap

Backend: Node.js, Express.js

Database: MongoDB with Mongoose

Security & Utility: JWT, Arcjet (rate limiting & bot protection), Upstash (email workflows), dotenv, CORS

🚀 Features
✅ JWT Authentication
Secure login/signup flow

Password hashing using bcrypt

Token-based session management with protected routes

📊 Subscription Management
Create, update, delete, and list subscriptions

Store and manage fields like price, currency, frequency, category, etc.

Real-time validation with backend schemas

🧠 Database Modeling
Structured models with Mongoose for users, subscriptions, and payments

Relationships between users and their subscriptions

🔁 Rate Limiting & Bot Protection (Arcjet)
Arcjet SDK integrated to:

Prevent abusive traffic

Protect login and registration endpoints from brute force attacks

Identify bot-like behavior and block requests accordingly

Configured global rate limiting and per-IP throttling on critical routes

🧱 Clean Architecture
Modular folder structure

Controllers, routes, models, middleware separated

Easily scalable for new features and services

🛠️ Global Error Handling
Centralized error handler middleware

Validation using express-validator or custom schema checks

📬 Email Notifications (via Upstash)
Automatically sends subscription renewal reminders

Upstash queue with webhook triggers for scalable messaging

🔐 Security Highlights
Arcjet Rate Limiting
Arcjet provides intelligent rate-limiting and bot protection by analyzing behavior patterns. In this project:

Login and signup routes are protected from brute-force attacks.

All API routes have default rate-limiting policies.

Suspicious behavior triggers captchas or denial responses.

🔗 Learn more at https://arcjet.com/

🧪 Testing
Use Postman or any REST client to test the API endpoints:

POST /api/auth/signup

POST /api/auth/login

GET /api/subscriptions/

POST /api/subscriptions/

PUT /api/subscriptions/:id

DELETE /api/subscriptions/:id

📌 Future Enhancements
Stripe integration for real payments

User dashboards with analytics

Admin panel for managing users & plans

Mobile responsive UI

📄 License
This project is open-source and available under the MIT License.
