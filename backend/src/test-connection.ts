import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    const url = process.env.DATABASE_URL || '';
    const maskedUrl = url.replace(/:[^:]*@/, ':****@');
    console.log('Testing connection to:', maskedUrl);

    try {
        await prisma.$connect();
        console.log('Prisma $connect() successful!');
        const count = await prisma.user.count();
        console.log('User count:', count);
    } catch (error: any) {
        console.error('--- CONNECTION FAILED ---');
        console.error('Message:', error.message);
        console.error('Code:', error.code);
        console.error('Stack:', error.stack);
        if (error.meta) console.error('Meta:', JSON.stringify(error.meta, null, 2));
        console.error('--------------------------');
    } finally {
        await prisma.$disconnect();
    }
}

main();
