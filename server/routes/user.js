const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');
const prisma = new PrismaClient();

// Update profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { nickname, avatar } = req.body;
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { ...(nickname && { nickname }), ...(avatar && { avatar }) }
        });
        res.json({ success: true, data: { nickname: user.nickname, avatar: user.avatar } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Change login password
router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) return res.status(400).json({ success: false, message: 'Both passwords required' });

        const valid = await bcrypt.compare(currentPassword, req.user.password);
        if (!valid) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

        const hashed = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });
        res.json({ success: true, message: 'Password changed' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Set/Change transaction password
router.put('/transaction-password', auth, async (req, res) => {
    try {
        const { password } = req.body;
        if (!password || password.length !== 6) return res.status(400).json({ success: false, message: '6-digit password required' });

        const hashed = await bcrypt.hash(password, 10);
        await prisma.user.update({ where: { id: req.user.id }, data: { transactionPassword: hashed } });
        res.json({ success: true, message: 'Transaction password set' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Submit KYC
router.post('/kyc', auth, async (req, res) => {
    try {
        const { name, idNumber, country } = req.body;
        if (!name || !idNumber || !country) return res.status(400).json({ success: false, message: 'All fields required' });

        await prisma.user.update({
            where: { id: req.user.id },
            data: { kycName: name, kycIdNumber: idNumber, kycCountry: country, kycStatus: 'pending' }
        });
        res.json({ success: true, message: 'KYC submitted for review' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get referral info
router.get('/referrals', auth, async (req, res) => {
    try {
        const referrals = await prisma.user.findMany({
            where: { invitedBy: req.user.inviteCode },
            select: { id: true, email: true, vipLevel: true, createdAt: true }
        });
        res.json({ success: true, data: { inviteCode: req.user.inviteCode, count: referrals.length, referrals } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get withdrawal addresses
router.get('/addresses', auth, async (req, res) => {
    try {
        const addresses = await prisma.withdrawAddress.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: addresses });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Add withdrawal address
router.post('/addresses', auth, async (req, res) => {
    try {
        const { label, coin, network, address } = req.body;
        if (!label || !coin || !network || !address) return res.status(400).json({ success: false, message: 'All fields required' });

        const addr = await prisma.withdrawAddress.create({ data: { userId: req.user.id, label, coin, network, address } });
        res.json({ success: true, data: addr });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete withdrawal address
router.delete('/addresses/:id', auth, async (req, res) => {
    try {
        await prisma.withdrawAddress.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
        res.json({ success: true, message: 'Address deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
