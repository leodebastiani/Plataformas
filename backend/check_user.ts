
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkUser() {
    console.log('Checking for user test@example.com...');
    const user = await prisma.user.findUnique({
        where: { email: 'test@example.com' }
    });

    if (user && user.password) {
        console.log('User found:', user);
        const isMatch = await bcrypt.compare('password123', user.password);
        console.log('Password match for "password123":', isMatch);
    } else {
        console.log('User NOT found or has no password.');
    }
}

checkUser()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
