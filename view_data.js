const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Article = require('./models/Article');
const Quiz = require('./models/Quiz');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/shieldhub')
    .then(async () => {
        console.log('\n📱 --- SHIELDHUB DATABASE CONTENT --- 📱\n');

        // 1. Admins
        const admins = await Admin.find().select('username lastLogin');
        console.log(`👤 ADMINS (${admins.length})`);
        admins.forEach(a => console.log(`   - ${a.username} (Last login: ${a.lastLogin ? a.lastLogin.toDateString() : 'Never'})`));

        // 2. Articles
        const articles = await Article.find().select('title category');
        console.log(`\n📰 ARTICLES (${articles.length})`);
        articles.forEach((a, i) => console.log(`   ${i + 1}. ${a.title} [${a.category}]`));

        // 3. Quiz Questions
        const quizCount = await Quiz.countDocuments();
        console.log(`\n❓ QUIZ QUESTIONS: ${quizCount} total questions stored.`);

        console.log('\n----------------------------------------');
        console.log('To edit this data, please use the Admin Dashboard at http://localhost:3000/admin');

        mongoose.connection.close();
    })
    .catch(err => console.error('Error:', err));
