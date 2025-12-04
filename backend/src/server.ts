import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || 'file:./dev.db',
        },
    },
});

// Enable foreign key constraints for SQLite
prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON;').catch(console.error);
import authRoutes from './routes/auth.routes';
import bcrypt from 'bcryptjs';
import userRoutes from './routes/user.routes';
import sectorRoutes from './routes/sector.routes';
import platformRoutes from './routes/platform.routes';
import adminRoutes from './routes/admin.routes';
import { seedSectors } from './controllers/sector.controller';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sectors', sectorRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Platform Management System API');
});

async function seedUsers() {
    const existing = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
    if (!existing) {
        const hashed = await bcrypt.hash('password123', 10);
        await prisma.user.create({
            data: {
                name: 'Test Admin',
                email: 'test@example.com',
                password: hashed,
                role: 'ADMIN',
                status: 'ACTIVE',
                // optional fields left null
            }
        });
        console.log('✅ Seeded default test user');
    }
}

seedSectors()
    .then(() => seedUsers())
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((e) => {
        console.error('❌ Seeding error', e);
        process.exit(1);
    });
