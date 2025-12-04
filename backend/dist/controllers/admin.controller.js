"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpiringPlatforms = exports.toggleAdminRole = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const toggleAdminRole = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role: newRole },
        });
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user role' });
    }
};
exports.toggleAdminRole = toggleAdminRole;
const getExpiringPlatforms = async (req, res) => {
    try {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const platforms = await prisma.platform.findMany();
        const expiringPlatforms = platforms.filter(p => p.expirationDate && p.expirationDate <= thirtyDaysFromNow && p.status === 'ACTIVE');
        res.json(expiringPlatforms);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching expiring platforms' });
    }
};
exports.getExpiringPlatforms = getExpiringPlatforms;
