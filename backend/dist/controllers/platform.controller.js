"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlatform = exports.updatePlatform = exports.createPlatform = exports.getPlatforms = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getPlatforms = async (req, res) => {
    try {
        const { sector, status, expiring } = req.query;
        const where = {};
        if (sector)
            where.sector = sector;
        if (status)
            where.status = status;
        let platforms = await prisma.platform.findMany({ where });
        // Filter expiring platforms (within 30 days)
        if (expiring === 'true') {
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            platforms = platforms.filter(p => p.expirationDate && p.expirationDate <= thirtyDaysFromNow);
        }
        res.json(platforms);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching platforms' });
    }
};
exports.getPlatforms = getPlatforms;
const createPlatform = async (req, res) => {
    const { name, description, sector, users, licenseType, expirationDate, status } = req.body;
    try {
        const platform = await prisma.platform.create({
            data: { name, description, sector, users, licenseType, expirationDate: expirationDate ? new Date(expirationDate) : null, status },
        });
        res.status(201).json(platform);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating platform' });
    }
};
exports.createPlatform = createPlatform;
const updatePlatform = async (req, res) => {
    const { id } = req.params;
    const { name, description, sector, users, licenseType, expirationDate, status } = req.body;
    try {
        const platform = await prisma.platform.update({
            where: { id },
            data: { name, description, sector, users, licenseType, expirationDate: expirationDate ? new Date(expirationDate) : null, status },
        });
        res.json(platform);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating platform' });
    }
};
exports.updatePlatform = updatePlatform;
const deletePlatform = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.platform.delete({ where: { id } });
        res.json({ message: 'Platform deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting platform' });
    }
};
exports.deletePlatform = deletePlatform;
