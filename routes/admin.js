const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Article = require('../models/Article');
const Quiz = require('../models/Quiz');
const Resource = require('../models/Resource');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = require('../middleware/upload');

// Redirect /admin to /admin/login
router.get('/', (req, res) => {
    res.redirect('/admin/login');
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.redirect('/admin/login');
};

// Initialize default admin if none exists
const initializeAdmin = async () => {
    try {
        if (mongoose.connection.readyState !== 1) {
            // Wait for connection to open before initializing
            mongoose.connection.once('open', async () => {
                try {
                    const adminCount = await Admin.countDocuments();
                    if (adminCount === 0) {
                        const defaultAdmin = new Admin({
                            username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
                            password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'
                        });
                        await defaultAdmin.save();
                        console.log('Default admin initialized successfully.');
                    }
                } catch (err) {
                    console.error('Error initializing admin after connection open:', err);
                }
            });
            return;
        }

        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            const defaultAdmin = new Admin({
                username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
                password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'
            });
            await defaultAdmin.save();
            console.log('Default admin initialized successfully.');
        }
    } catch (error) {
        console.error('Error initializing admin:', error);
    }
};

// Initialize admin on module load / connection open
initializeAdmin();

// ============================================
// Authentication Routes
// ============================================

// Helper function to generate CAPTCHA numbers
const generateCaptcha = () => {
    return {
        num1: Math.floor(Math.random() * 10) + 1,
        num2: Math.floor(Math.random() * 10) + 1
    };
};

// GET - Login Page
router.get('/login', (req, res) => {
    if (req.session && req.session.isAdmin) {
        return res.redirect('/admin/dashboard');
    }
    
    const captcha = generateCaptcha();

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
        return res.render('admin-login', {
            title: 'Admin Login',
            error: 'Database connection is not established. Please check your database settings and ensure your IP is whitelisted.',
            captchaNum1: captcha.num1,
            captchaNum2: captcha.num2
        });
    }

    res.render('admin-login', {
        title: 'Admin Login',
        error: null,
        captchaNum1: captcha.num1,
        captchaNum2: captcha.num2
    });
});

// POST - Login
router.post('/login', async (req, res) => {
    try {
        const { username, password, captchaAnswer, captchaNum1, captchaNum2 } = req.body;

        // Generate new CAPTCHA for potential error response
        const newCaptcha = generateCaptcha();

        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.render('admin-login', {
                title: 'Admin Login',
                error: 'Database connection is not established. Please check your database settings and ensure your IP is whitelisted.',
                captchaNum1: newCaptcha.num1,
                captchaNum2: newCaptcha.num2
            });
        }

        // Validate CAPTCHA
        const expectedAnswer = parseInt(captchaNum1) + parseInt(captchaNum2);
        if (parseInt(captchaAnswer) !== expectedAnswer) {
            return res.render('admin-login', {
                title: 'Admin Login',
                error: 'Incorrect CAPTCHA answer. Please try again.',
                captchaNum1: newCaptcha.num1,
                captchaNum2: newCaptcha.num2
            });
        }

        const admin = await Admin.findOne({ username: username.toLowerCase() });

        if (!admin) {
            return res.render('admin-login', {
                title: 'Admin Login',
                error: 'Invalid username or password',
                captchaNum1: newCaptcha.num1,
                captchaNum2: newCaptcha.num2
            });
        }

        const isMatch = await admin.comparePassword(password);

        if (!isMatch) {
            return res.render('admin-login', {
                title: 'Admin Login',
                error: 'Invalid username or password',
                captchaNum1: newCaptcha.num1,
                captchaNum2: newCaptcha.num2
            });
        }

        // Update last login
        admin.lastLogin = Date.now();
        await admin.save();

        // Set session
        req.session.isAdmin = true;
        req.session.adminId = admin._id;
        req.session.adminUsername = admin.username;

        res.redirect('/admin/dashboard');

    } catch (error) {
        console.error('Login error:', error);
        const newCaptcha = generateCaptcha();
        res.render('admin-login', {
            title: 'Admin Login',
            error: 'An error occurred. Please try again.',
            captchaNum1: newCaptcha.num1,
            captchaNum2: newCaptcha.num2
        });
    }
});

// GET - Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destroy error:', err);
        }
        res.redirect('/admin/login');
    });
});

// Secret recovery key (in production, this should be stored securely)
const SECRET_RECOVERY_KEY = process.env.ADMIN_RECOVERY_KEY || 'default_recovery_key';

// GET - Forgot Password Page
router.get('/forgot-password', (req, res) => {
    if (req.session && req.session.isAdmin) {
        return res.redirect('/admin/dashboard');
    }
    res.render('admin-forgot-password', {
        title: 'Forgot Password',
        success: null,
        error: null
    });
});

// POST - Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
        const { username, secretKey, newPassword, confirmPassword } = req.body;

        // Validate secret key
        if (secretKey !== SECRET_RECOVERY_KEY) {
            return res.render('admin-forgot-password', {
                title: 'Forgot Password',
                success: null,
                error: 'Invalid secret recovery key'
            });
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            return res.render('admin-forgot-password', {
                title: 'Forgot Password',
                success: null,
                error: 'Passwords do not match'
            });
        }

        // Check password length
        if (newPassword.length < 6) {
            return res.render('admin-forgot-password', {
                title: 'Forgot Password',
                success: null,
                error: 'Password must be at least 6 characters'
            });
        }

        // Find admin by username
        const admin = await Admin.findOne({ username: username.toLowerCase() });

        if (!admin) {
            return res.render('admin-forgot-password', {
                title: 'Forgot Password',
                success: null,
                error: 'Username not found'
            });
        }

        // Update password
        admin.password = newPassword;
        await admin.save();

        res.render('admin-forgot-password', {
            title: 'Forgot Password',
            success: 'Password reset successfully! You can now login with your new password.',
            error: null
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.render('admin-forgot-password', {
            title: 'Forgot Password',
            success: null,
            error: 'An error occurred. Please try again.'
        });
    }
});

// ============================================
// Dashboard Routes
// ============================================

// GET - Dashboard
router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const articleCount = await Article.countDocuments();
        const quizCount = await Quiz.countDocuments();

        res.render('admin-dashboard', {
            title: 'Admin Dashboard',
            username: req.session.adminUsername,
            stats: {
                articles: articleCount,
                quizQuestions: quizCount
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.render('admin-dashboard', {
            title: 'Admin Dashboard',
            username: req.session.adminUsername,
            stats: {
                articles: 0,
                quizQuestions: 0
            }
        });
    }
});

// ============================================
// Article Management Routes
// ============================================

// GET - Articles Management Page
router.get('/articles', isAuthenticated, async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.render('admin-articles', {
            title: 'Manage Articles',
            articles: articles,
            username: req.session.adminUsername,
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (error) {
        console.error('Articles fetch error:', error);
        res.render('admin-articles', {
            title: 'Manage Articles',
            articles: [],
            success: null,
            error: 'Error loading articles'
        });
    }
});

// POST - Add Article
router.post('/articles/add', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
        const { title, description, websiteUrl, imageUrl, category } = req.body;

        // Determine image source: uploaded file takes priority, then imageUrl
        let imagePath = '';
        if (req.file) {
            imagePath = '/uploads/' + req.file.filename;
        } else if (imageUrl && imageUrl.trim()) {
            imagePath = imageUrl.trim();
        }

        const article = new Article({
            title,
            description,
            websiteUrl,
            category: category || 'breach',
            image: imagePath
        });

        await article.save();
        res.redirect('/admin/articles?success=Article added successfully');

    } catch (error) {
        console.error('Add article error:', error);
        res.redirect('/admin/articles?error=Error adding article');
    }
});

// POST - Delete Article
router.post('/articles/delete/:id', isAuthenticated, async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (article && article.image) {
            const imagePath = path.join(__dirname, '..', 'public', article.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Article.findByIdAndDelete(req.params.id);
        res.redirect('/admin/articles?success=Article deleted successfully');

    } catch (error) {
        console.error('Delete article error:', error);
        res.redirect('/admin/articles?error=Error deleting article');
    }
});

// POST - Edit Article
router.post('/articles/edit/:id', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
        const { title, description, websiteUrl, imageUrl, category } = req.body;
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.redirect('/admin/articles?error=Article not found');
        }

        // Update basic fields
        article.title = title;
        article.description = description;
        article.websiteUrl = websiteUrl;
        article.category = category || article.category || 'breach';

        // Handle image update
        if (req.file) {
            // Delete old image if it's a local file
            if (article.image && article.image.startsWith('/uploads/')) {
                const oldImagePath = path.join(__dirname, '..', 'public', article.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            article.image = '/uploads/' + req.file.filename;
        } else if (imageUrl && imageUrl.trim()) {
            // Use new image URL if provided
            // Delete old local image if exists
            if (article.image && article.image.startsWith('/uploads/')) {
                const oldImagePath = path.join(__dirname, '..', 'public', article.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            article.image = imageUrl.trim();
        }
        // If neither provided, keep existing image

        await article.save();
        res.redirect('/admin/articles?success=Article updated successfully');

    } catch (error) {
        console.error('Edit article error:', error);
        res.redirect('/admin/articles?error=Error updating article');
    }
});

// ============================================
// Quiz Management Routes
// ============================================

// GET - Quiz Management Page
// GET - Quiz Management Page
router.get('/quiz', isAuthenticated, async (req, res) => {
    try {
        const questions = await Quiz.find().sort({ createdAt: -1 });

        // Get or create default resource
        let resource = await Resource.findOne();
        if (!resource) {
            resource = await Resource.create({});
        }

        res.render('admin-quiz', {
            title: 'Manage Quiz',
            questions: questions,
            resource: resource,
            username: req.session.adminUsername,
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (error) {
        console.error('Quiz fetch error:', error);
        res.render('admin-quiz', {
            title: 'Manage Quiz',
            questions: [],
            resource: { title: '', url: '', description: '' },
            username: req.session.adminUsername,
            success: null,
            error: 'Error loading questions'
        });
    }
});

// POST - Update Resource Link
router.post('/quiz/resource', isAuthenticated, async (req, res) => {
    try {
        const { title, url, description } = req.body;

        let resource = await Resource.findOne();
        if (resource) {
            resource.title = title;
            resource.url = url;
            resource.description = description;
            await resource.save();
        } else {
            await Resource.create({ title, url, description });
        }

        res.redirect('/admin/quiz?success=Resource link updated successfully');
    } catch (error) {
        console.error('Error updating resource:', error);
        res.redirect('/admin/quiz?error=Failed to update resource link');
    }
});

// POST - Add Quiz Question
router.post('/quiz/add', isAuthenticated, async (req, res) => {
    try {
        const { question, option1, option2, option3, option4, correctAnswer, difficulty } = req.body;

        const quiz = new Quiz({
            question,
            options: [option1, option2, option3, option4],
            correctAnswer: parseInt(correctAnswer),
            difficulty: difficulty || 'easy'
        });

        await quiz.save();
        res.redirect('/admin/quiz?success=Question added successfully');

    } catch (error) {
        console.error('Add quiz error:', error);
        res.redirect('/admin/quiz?error=Error adding question');
    }
});

// POST - Delete Quiz Question
router.post('/quiz/delete/:id', isAuthenticated, async (req, res) => {
    try {
        await Quiz.findByIdAndDelete(req.params.id);
        res.redirect('/admin/quiz?success=Question deleted successfully');

    } catch (error) {
        console.error('Delete quiz error:', error);
        res.redirect('/admin/quiz?error=Error deleting question');
    }
});

// ============================================
// Settings Routes
// ============================================

// GET - Settings Page
router.get('/settings', isAuthenticated, (req, res) => {
    res.render('admin-settings', {
        title: 'Admin Settings',
        username: req.session.adminUsername,
        success: req.query.success || null,
        error: req.query.error || null
    });
});

// POST - Change Username
router.post('/change-username', isAuthenticated, async (req, res) => {
    try {
        const { newUsername, password } = req.body;

        if (!newUsername || newUsername.trim().length < 3) {
            return res.redirect('/admin/settings?error=Username must be at least 3 characters');
        }

        const admin = await Admin.findById(req.session.adminId);

        // Verify password before changing username
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.redirect('/admin/settings?error=Incorrect password');
        }

        // Check if username already exists
        const existingAdmin = await Admin.findOne({ username: newUsername.toLowerCase() });
        if (existingAdmin && existingAdmin._id.toString() !== req.session.adminId) {
            return res.redirect('/admin/settings?error=Username already exists');
        }

        admin.username = newUsername.toLowerCase();
        await admin.save();

        // Update session with new username
        req.session.adminUsername = admin.username;

        res.redirect('/admin/settings?success=Username updated successfully');

    } catch (error) {
        console.error('Change username error:', error);
        res.redirect('/admin/settings?error=Error updating username');
    }
});

// POST - Change Password
router.post('/change-password', isAuthenticated, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.redirect('/admin/settings?error=New passwords do not match');
        }

        const admin = await Admin.findById(req.session.adminId);

        const isMatch = await admin.comparePassword(currentPassword);
        if (!isMatch) {
            return res.redirect('/admin/settings?error=Incorrect current password');
        }

        admin.password = newPassword;
        await admin.save();

        res.redirect('/admin/settings?success=Password updated successfully');

    } catch (error) {
        console.error('Change password error:', error);
        res.redirect('/admin/settings?error=Error updating password');
    }
});

module.exports = router;
