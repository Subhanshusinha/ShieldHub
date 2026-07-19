const express = require('express');
const router = express.Router();

const Article = require('../models/Article');

// Shared upload middleware not needed here as we removed the POST route that used it
// const upload = require('../middleware/upload');

// Get all articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.render('cybersecurity-article', {
      title: 'Cybersecurity Articles',
      articles: articles
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Error fetching articles' });
  }
});





// Get article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send('Article not found');
    }
    res.render('article-detail', {
      title: article.title,
      article: article
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Error fetching article' });
  }
});

module.exports = router;


