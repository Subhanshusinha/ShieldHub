const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: 'Become a Cyber Hero'
    },
    url: {
        type: String,
        required: true,
        default: 'https://www.cisa.gov/cyber-essentials'
    },
    description: {
        type: String,
        required: true,
        default: 'Essential guide for everyone to stay safe online.'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Ensure only one resource document exists (singleton pattern via logic, or just always fetch the first one)
const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
