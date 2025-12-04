"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSector = exports.updateSector = exports.createSector = exports.getSectors = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const PREDEFINED_SECTORS = [
    'Administrative',
    'Legal',
    'HR',
    'Commercial',
    'Business Development',
    'Product, Commercial & HR',
    'Information Security',
    'System Engineering',
    'Customer Experience - Back Office',
    'Customer Experience - Special Projects',
    'Tech Development',
    'Data Engineering',
    'Infrastructure & Architecture',
    'IT Operations',
    'Affiliates',
    'AML',
    'Business Support',
    'Content',
    'Customer Experience',
    'Customer Experience - Phone Support',
    'Digital Marketing',
    'Executive',
    'Finance',
    'Legal & Compliance',
    'KTO Studio - Design',
    'Marketing',
    'Marketing Operations',
    'Marketing Research',
    'N/A',
    'Operations',
    'Payments',
    'Responsible Gambling',
    'SEO',
    'Tech',
    'Tech QA',
    'TESTING Department',
];
const getSectors = async (req, res) => {
    try {
        // Return predefined sectors as objects with id and name
        const sectors = PREDEFINED_SECTORS.map((name, index) => ({
            id: `sector-${index}`,
            name,
        }));
        res.json(sectors);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching sectors' });
    }
};
exports.getSectors = getSectors;
const createSector = async (req, res) => {
    try {
        const { name } = req.body;
        const sector = await prisma.sector.create({ data: { name } });
        res.status(201).json(sector);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating sector' });
    }
};
exports.createSector = createSector;
const updateSector = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const sector = await prisma.sector.update({
            where: { id },
            data: { name },
        });
        res.json(sector);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating sector' });
    }
};
exports.updateSector = updateSector;
const deleteSector = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.sector.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting sector' });
    }
};
exports.deleteSector = deleteSector;
