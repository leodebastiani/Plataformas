import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

export const seedSectors = async () => {
    try {
        const count = await prisma.sector.count();
        if (count === 0) {
            console.log('Seeding sectors...');
            for (const name of PREDEFINED_SECTORS) {
                await prisma.sector.create({ data: { name } });
            }
            console.log('Sectors seeded.');
        }
    } catch (error) {
        console.error('Error seeding sectors:', error);
    }
};

export const getSectors = async (req: Request, res: Response) => {
    try {
        const sectors = await prisma.sector.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(sectors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sectors' });
    }
};

export const createSector = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const sector = await prisma.sector.create({ data: { name } });
        res.status(201).json(sector);
    } catch (error) {
        res.status(500).json({ message: 'Error creating sector' });
    }
};

export const updateSector = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const sector = await prisma.sector.update({
            where: { id },
            data: { name },
        });
        res.json(sector);
    } catch (error) {
        res.status(500).json({ message: 'Error updating sector' });
    }
};

export const deleteSector = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.sector.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting sector' });
    }
};
