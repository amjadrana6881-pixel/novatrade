const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');
const prisma = new PrismaClient();

// Get all robots
router.get('/', async (req, res) => {
    try {
        const robots = await prisma.robot.findMany({ where: { isActive: true }, orderBy: { price: 'asc' } });
        res.json({ success: true, data: robots });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Purchase robot
router.post('/purchase', auth, async (req, res) => {
    try {
        const { robotId } = req.body;
        if (!robotId) return res.status(400).json({ success: false, message: 'Robot ID required' });

        const robot = await prisma.robot.findUnique({ where: { id: robotId } });
        if (!robot || !robot.isActive) return res.status(404).json({ success: false, message: 'Robot not found' });

        // Check USDT balance (no VIP level restriction - just need enough balance)
        const wallet = await prisma.wallet.findUnique({
            where: { userId_coin_account: { userId: req.user.id, coin: 'USDT', account: 'spot' } }
        });
        if (!wallet || wallet.available < robot.price) return res.status(400).json({ success: false, message: 'Insufficient USDT balance' });

        // Fixed 3-day period 
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + (robot.period || 3));

        await prisma.$transaction([
            prisma.wallet.update({ where: { id: wallet.id }, data: { available: { decrement: robot.price } } }),
            prisma.robotOrder.create({
                data: { userId: req.user.id, robotId: robot.id, amount: robot.price, endDate }
            })
        ]);

        const profitText = robot.fixedProfit > 0
            ? `Fixed profit: ${robot.fixedProfit} USDT`
            : `Daily return: ${robot.dailyReturn}%`;

        await prisma.notification.create({
            data: { userId: req.user.id, type: 'system', title: 'Robot Purchased', content: `${robot.name} activated! ${profitText}, Period: ${robot.period || 3} days.` }
        });

        res.json({ success: true, message: `${robot.name} purchased successfully` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get my robot orders
router.get('/orders', auth, async (req, res) => {
    try {
        const { status } = req.query;
        const where = { userId: req.user.id };
        if (status) where.status = status;

        const orders = await prisma.robotOrder.findMany({ where, include: { robot: true }, orderBy: { startDate: 'desc' } });
        res.json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
