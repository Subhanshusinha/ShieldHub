const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// Phishing Detection API
router.post('/phishing/detect', (req, res) => {
  const { email, url } = req.body;
  let input = email || url || '';

  if (!input) {
    return res.json({
      success: false,
      message: 'Please provide an email or URL to analyze'
    });
  }

  // Simple phishing detection logic
  const suspiciousPatterns = [
    /(?:http|https):\/\/(?:www\.)?(?:bit\.ly|tinyurl|t\.co|goo\.gl|short\.link)/i,
    /(?:urgent|immediate|action required|verify account|suspended|locked)/i,
    /(?:paypal|amazon|microsoft|apple|google)\.(?:verify|secure|account)/i,
    /(?:click here|verify now|update immediately)/i,
    /(?:free|prize|winner|congratulations)/i,
    /(?:\.exe|\.zip|\.rar|\.scr)$/i
  ];

  let riskScore = 0;
  const detectedPatterns = [];

  suspiciousPatterns.forEach((pattern, index) => {
    if (pattern.test(input)) {
      riskScore += 20;
      detectedPatterns.push(`Pattern ${index + 1} detected`);
    }
  });

  // Check for suspicious domains
  if (input.includes('http')) {
    try {
      const urlObj = new URL(input);
      const domain = urlObj.hostname;

      // Check for domain mismatches
      if (domain.includes('paypal') && !domain.includes('paypal.com')) {
        riskScore += 30;
        detectedPatterns.push('Suspicious domain mismatch');
      }

      // Check for IP addresses
      if (/^\d+\.\d+\.\d+\.\d+$/.test(domain)) {
        riskScore += 25;
        detectedPatterns.push('IP address used instead of domain');
      }
    } catch (e) {
      riskScore += 15;
      detectedPatterns.push('Invalid URL format');
    }
  }

  let status = 'safe';
  if (riskScore >= 70) {
    status = 'high-risk';
  } else if (riskScore >= 40) {
    status = 'medium-risk';
  } else if (riskScore > 0) {
    status = 'low-risk';
  }

  res.json({
    success: true,
    status: status,
    riskScore: Math.min(riskScore, 100),
    detectedPatterns: detectedPatterns,
    message: status === 'safe'
      ? 'This appears to be safe'
      : `This appears to be ${status.replace('-', ' ')}`
  });
});

// Vulnerability Scanner API
router.post('/vulnerability/scan', (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.json({
      success: false,
      message: 'Please provide a URL to scan'
    });
  }

  // Simple vulnerability scanning logic
  const vulnerabilities = [];
  let riskLevel = 'low';

  // Check for HTTPS
  if (!url.startsWith('https://')) {
    vulnerabilities.push({
      type: 'Missing HTTPS',
      severity: 'medium',
      description: 'The website does not use HTTPS encryption'
    });
  }

  // Check for common vulnerable patterns
  if (url.includes('admin') || url.includes('login')) {
    vulnerabilities.push({
      type: 'Sensitive Endpoint',
      severity: 'info',
      description: 'Sensitive endpoint detected'
    });
  }

  // Simulate scanning
  const hasVulnerabilities = vulnerabilities.length > 0;
  if (hasVulnerabilities) {
    riskLevel = 'medium';
  }

  res.json({
    success: true,
    url: url,
    riskLevel: riskLevel,
    vulnerabilities: vulnerabilities,
    message: hasVulnerabilities
      ? `Found ${vulnerabilities.length} potential issue(s)`
      : 'No obvious vulnerabilities detected'
  });
});

// Password Strength Checker API
router.post('/password/check', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.json({
      success: false,
      message: 'Please provide a password to check'
    });
  }

  let strength = 0;
  const feedback = [];

  // Length check
  if (password.length >= 12) {
    strength += 25;
  } else if (password.length >= 8) {
    strength += 15;
    feedback.push('Consider using a longer password (12+ characters)');
  } else {
    feedback.push('Password is too short (minimum 8 characters)');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    strength += 20;
  } else {
    feedback.push('Add uppercase letters');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    strength += 20;
  } else {
    feedback.push('Add lowercase letters');
  }

  // Number check
  if (/\d/.test(password)) {
    strength += 15;
  } else {
    feedback.push('Add numbers');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    strength += 20;
  } else {
    feedback.push('Add special characters');
  }

  // Common password check
  const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    strength -= 30;
    feedback.push('Avoid common passwords');
  }

  let strengthLevel = 'weak';
  if (strength >= 80) {
    strengthLevel = 'strong';
  } else if (strength >= 60) {
    strengthLevel = 'moderate';
  } else if (strength >= 40) {
    strengthLevel = 'fair';
  }

  res.json({
    success: true,
    strength: Math.max(0, Math.min(100, strength)),
    strengthLevel: strengthLevel,
    feedback: feedback,
    message: `Password strength: ${strengthLevel}`
  });
});

// Like Article API
router.post('/articles/:id/like', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.json({ success: false, message: 'Article not found' });
    }

    article.likes += 1;
    await article.save();

    res.json({
      success: true,
      likes: article.likes
    });
  } catch (error) {
    console.error('Error liking article:', error);
    res.json({ success: false, message: 'Error liking article' });
  }
});

// Add Comment API
router.post('/articles/:id/comment', async (req, res) => {
  try {
    const { author, content } = req.body;
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.json({ success: false, message: 'Article not found' });
    }

    article.comments.push({
      author: author || 'Anonymous',
      content: content
    });

    await article.save();

    res.json({
      success: true,
      comment: article.comments[article.comments.length - 1]
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.json({ success: false, message: 'Error adding comment' });
  }
});

// Get Article Details API
router.get('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.json({ success: false, message: 'Article not found' });
    }
    res.json({ success: true, article: article });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.json({ success: false, message: 'Error fetching article' });
  }
});



module.exports = router;

