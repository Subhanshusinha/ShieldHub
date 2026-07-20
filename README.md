# 🛡️ ShieldHub — Everything about protection in one hub

<p align="center">
  <img src="./public/images/public/images/Screenshot 2026-07-20 111001.png" alt="ShieldHub Banner" width="700" style="border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.35);" />
</p>

<p align="center">
  <img src="./public/images/public/images/Screenshot 2026-07-20 111021.png" alt="ShieldHub Banner" width="700" style="border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.35);" />
</p>

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-v20+-43853D?style=for-the-badge&logo=node.js&logoColor=white" /></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-v4-000000?style=for-the-badge&logo=express&logoColor=white" /></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-NoSQL-47A248?style=for-the-badge&logo=mongodb&logoColor=white" /></a>
  <a href="https://ejs.co/"><img src="https://img.shields.io/badge/EJS-Templates-B4CA65?style=for-the-badge&logo=html5&logoColor=white" /></a>
</p>

---

## 🌟 Introduction

**ShieldHub** is a premium, high-performance, and feature-rich cybersecurity education hub. It equips everyday internet users with interactive tools to scan files, audit site vulnerabilities, test passwords, and decode hidden images—all wrapped inside an ultra-modern dark UI equipped with gorgeous neon flows, ambient back-glows, and fluid micro-animations.

---

## 🛠️ Interactive Security Tools

ShieldHub bundles 5 core interactive security tools directly into the homepage:

1. **📰 Cybercrime Article Slider**
   * A dynamic rotating carousel that cycles through cybersecurity blogs and news uploaded directly from the Admin Panel.
2. **🎣 Phishing Detective**
   * Paste raw email text or enter a URL to run heuristic scans matching malicious lookalike domains and urgency triggers.
3. **🎭 Steganography Workspace**
   * Hide secret text messages inside PNG images (Encoding) and extract them back (Decoding) securely using custom keys. **100% client-side** using HTML5 Canvas API for total privacy.
4. **🔍 Vulnerability Scanner**
   * Input domain URLs to check for SSL/HTTPS configuration, missing security headers (`CSP`, `X-Frame-Options`), and directory exposures.
5. **🔑 Password Strength Checker**
   * Evaluates password entropy, estimated brute-force time, and issues feedback to make credentials hack-proof.

---

## 💻 Tech Stack

* **Frontend**: HTML5, Vanilla CSS3 (custom CSS variables, hardware-accelerated animations), JavaScript ES6+
* **Templating**: EJS (Embedded JavaScript Templates)
* **Backend**: Node.js, Express.js
* **Database**: MongoDB & Mongoose ORM
* **Session Security**: Express-Session
* **File Uploads**: Multer middleware

---

## 🚀 Quick Start & Run Instructions

Follow these simple steps to run ShieldHub locally on your system:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally.

### 2. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/shieldhub.git

# Enter project directory
cd shieldhub

# Install dependencies
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/shieldhub
SESSION_SECRET=your_super_secret_session_key
```

### 4. Seed Quiz Database (Optional but Recommended)
Run the built-in seed script to populate questions for the homepage interactive quiz:
```bash
node seed-quiz.js
```

### 5. Launch Server
```bash
# Start with standard node
node server.js

# Or start with nodemon for live reload
npx nodemon server.js
```
Open **`http://localhost:3000`** in your browser.

---

## 📁 Directory Structure

```bash
ShieldHub/
├── middleware/          # File upload configurations (Multer setup)
├── models/              # Mongoose database models (Admin, Article, Quiz, Resource)
├── public/              # Static files (CSS animations, images, custom JS)
├── routes/              # Express Router Controllers (APIs & admin routes)
├── views/               # EJS template engine screens & layouts
├── seed-quiz.js         # Initial quiz questions populator script
├── server.js            # Main entry file
└── package.json         # Project metadata and dependencies
```
