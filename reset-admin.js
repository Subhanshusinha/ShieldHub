/**
 * ShieldHub Admin Reset Script
 * Run with: node reset-admin.js
 * This will delete the existing admin and create a new one.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── NEW ADMIN CREDENTIALS (Loaded from .env for security) ────────────────────
const NEW_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const NEW_PASSWORD = process.env.ADMIN_PASSWORD || 'your_reset_password_here';
// ─────────────────────────────────────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shieldhub';

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date }
});

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Admin = mongoose.model('Admin', adminSchema);

async function resetAdmin() {
    try {
        console.log('\n🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected!\n');

        // Delete ALL existing admins
        const deleteResult = await Admin.deleteMany({});
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing admin(s).`);

        // Create fresh admin
        const newAdmin = new Admin({
            username: NEW_USERNAME,
            password: NEW_PASSWORD
        });
        await newAdmin.save();

        console.log('\n✅ ─────────────────────────────────────────────');
        console.log('   Admin account reset successfully!');
        console.log('──────────────────────────────────────────────');
        console.log(`   Username : ${NEW_USERNAME}`);
        console.log(`   Password : ${NEW_PASSWORD}`);
        console.log('──────────────────────────────────────────────');
        console.log('   Login at : http://localhost:3000/admin/login');
        console.log('─────────────────────────────────────────────\n');

    } catch (error) {
        console.error('\n❌ Error resetting admin:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB.\n');
    }
}

resetAdmin();
