const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    default: 'Anonymous'
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['breach', 'phishing', 'malware', 'ransomware', 'scam'],
    default: 'breach'
  },
  image: {
    type: String,
    default: ''
  },
  websiteUrl: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Article', articleSchema);


