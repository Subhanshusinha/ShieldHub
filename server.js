// ============================================================
// SHIELDHUB — Core Server Configuration & Routing
// ============================================================

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const compression = require('compression');
require('dotenv').config();

// Pre-load Models for performance
const Resource = require('./models/Resource');
const Article = require('./models/Article');
const Quiz = require('./models/Quiz');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// MIDDLEWARE CONFIGURATIONS
// ============================================================

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public', {
  maxAge: '1d' // Cache static files (images, css, js) for 1 day for instant reload speed
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true in production (HTTPS)
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Session state access for Views
app.use((req, res, next) => {
  res.locals.isAdmin = req.session && req.session.isAdmin;
  next();
});

// ============================================================
// DATABASE CONNECTION
// ============================================================

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shieldhub')
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// ============================================================
// ROUTE IMPORT & REGISTRATION — Alag routes register karne ke liye
// ============================================================

const articleRoutes = require('./routes/articles');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

// Registered endpoint sub-trees
app.use('/articles', articleRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// ============================================================
// MAIN PAGE ROUTING — Website ke pages render karne ke liye
// ============================================================

/**
 * GET /
 * Renders: index.ejs (Main Home Page)
 * UI par kya dikhta hai:
 *  - Typing animation aur cyber quotes rotator (Hero Section mein sabse upar).
 *  - Latest Cyber News rotating article box (Our Security Tools section ke andar pehla card).
 *  - Security Tools grid (Phishing Detective, Steganography, Vulnerability Scanner, Password Strength).
 *  - Interactive Cybersecurity Quiz game (sabse niche).
 */
app.get('/', async (req, res) => {
  try {
    let resource = await Resource.findOne();
    let articles = await Article.find().sort({ createdAt: -1 });

    if (!resource) {
      resource = {
        title: 'Become a Cyber Hero',
        url: 'https://www.cisa.gov/cyber-essentials',
        description: 'Essential guide for everyone to stay safe online.\nHelpful for Both tech and non-tech'
      };
    }

    res.render('index', {
      title: 'ShieldHub - Home',
      resource: resource,
      articles: articles
    });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.render('index', {
      title: 'ShieldHub - Home',
      resource: {
        title: 'Become a Cyber Hero',
        url: 'https://www.cisa.gov/cyber-essentials',
        description: 'Essential guide for everyone to stay safe online.\nHelpful for Both tech and non-tech'
      },
      articles: []
    });
  }
});

/**
 * GET /phishing-detective
 * Renders: phishing-detective.ejs (Phishing Detective Page)
 * UI par kya dikhta hai:
 *  - Phishing Detective card ke "Try Now" button par click karne par ye page open hota hai.
 *  - Isme suspicious emails aur links check karne ka interactive form aur output meter dikhta hai.
 */
app.get('/phishing-detective', (req, res) => {
  res.render('phishing-detective', { title: 'Phishing Detective' });
});

/**
 * GET /vulnerability-scanner
 * Renders: vulnerability-scanner.ejs (Vulnerability Scanner Page)
 * UI par kya dikhta hai:
 *  - Vulnerability Scanner card ke "Scan Now" button par click karne par ye page open hota hai.
 *  - Isme website scan karne ka scan bar aur details log report sheet dikhti hai.
 */
app.get('/vulnerability-scanner', (req, res) => {
  res.render('vulnerability-scanner', { title: 'Vulnerability Scanner' });
});

/**
 * GET /password-strength
 * Renders: password-strength.ejs (Password Strength Checker Page)
 * UI par kya dikhta hai:
 *  - Password Strength card ke "Check Now" button par click karne par ye page open hota hai.
 *  - Isme password check karne ka input area, feedback aur meter progress bar dikhta hai.
 */
app.get('/password-strength', (req, res) => {
  res.render('password-strength', { title: 'Password Strength Checker' });
});

/**
 * GET /cybersecurity-article
 * Renders: cybersecurity-article.ejs (Cybersecurity Articles List Page)
 * UI par kya dikhta hai:
 *  - Header bar mein "Articles" option par click karne par ye page open hota hai.
 *  - Isme database ke saare blogs aur cyber threat articles grids aur comments ke sath dikhte hain.
 */
app.get('/cybersecurity-article', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.render('cybersecurity-article', {
      title: 'Cybersecurity Articles',
      articles: articles
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.render('cybersecurity-article', {
      title: 'Cybersecurity Articles',
      articles: []
    });
  }
});

/**
 * GET /about
 * Renders: about.ejs (About Us Page)
 * UI par kya dikhta hai:
 *  - Header ya sidebar mein "About" link par click karne par ye page open hota hai.
 *  - Isme project details aur team information dikhti hai.
 */
app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

/**
 * GET /steganography
 * Renders: steganography.ejs (Steganography Tool Page)
 * UI par kya dikhta hai:
 *  - Steganography card ke "Try Now" button par click karne par ye page khulta hai.
 *  - Isme user kisi photo/image ke andar secret messages hide (chupa) ya reveal (khoj) sakta hai.
 */
app.get('/steganography', (req, res) => {
  res.render('steganography', {
    title: 'Steganography Tool',
    isAdmin: req.session.isAdmin || false
  });
});

/**
 * GET /search
 * Renders: search-results.ejs (Search Engine Results Page)
 * UI par kya dikhta hai:
 *  - Jab navigation bar ke top search bar se query search ki jati hai tab ye page khulta hai.
 *  - Isme search matching articles ya tool redirect links dikhte hain.
 */
app.get('/search', async (req, res) => {
  const query = req.query.q || '';
  let results = [];
  let searchType = '';

  if (query.toLowerCase().includes('phishing')) {
    searchType = 'phishing-detective';
  } else if (query.toLowerCase().includes('vulnerability')) {
    searchType = 'vulnerability-scanner';
  } else if (query.toLowerCase().includes('password')) {
    searchType = 'password-strength';
  } else if (query.toLowerCase().includes('steganography') || query.toLowerCase().includes('hide') || query.toLowerCase().includes('secret')) {
    searchType = 'steganography';
  }

  // Always attempt to find relevant articles for the search query to enrich the results page
  if (query.trim() !== '') {
    try {
      results = await Article.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  res.render('search-results', {
    title: 'Search Results',
    query: query,
    results: results,
    searchType: searchType
  });
});

// ============================================================
// BACKEND API ENDPOINTS — Home page ke components ke liye dynamic APIs
// ============================================================

/**
 * GET /api/quiz
 * Returns: JSON Array containing quiz questions
 * UI par kya dikhta hai:
 *  - Home page par jo game chalta hai, uske questions isi API se dynamic fetch hote hain.
 */
app.get('/api/quiz', async (req, res) => {
  try {
    const questions = await Quiz.find().select('question options correctAnswer');

    const formattedQuestions = questions.map(q => ({
      question: q.question,
      options: q.options,
      correct: q.correctAnswer
    }));

    res.json(formattedQuestions);
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({ error: 'Error fetching questions' });
  }
});

// ============================================================
// SERVER INITIALIZATION — Server start karne ke liye
// ============================================================

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
