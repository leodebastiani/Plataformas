"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, sector: true, position: true, status: true },
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};
exports.getUsers = getUsers;
const createUser = async (req, res) => {
    try {
        const { name, email, role, sector, position, status } = req.body;
        // Generate a random password for new users
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcryptjs_1.default.hash(randomPassword, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'ADMIN',
                sector,
                position,
                status: status || 'ACTIVE',
            },
        });
        res.status(201).json({ ...user, password: undefined, generatedPassword: randomPassword });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role, sector, position, status } = req.body;
        const data = { name, email, role, sector, position, status };
        if (password) {
            data.password = await bcryptjs_1.default.hash(password, 10);
        }
        const user = await prisma.user.update({
            where: { id },
            data,
        });
        res.json({ ...user, password: undefined });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id } });
        res.json({ message: 'User deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};
exports.deleteUser = deleteUser;
