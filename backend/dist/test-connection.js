"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient({
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
    }
    catch (error) {
        console.error('--- CONNECTION FAILED ---');
        console.error('Message:', error.message);
        console.error('Code:', error.code);
        console.error('Stack:', error.stack);
        if (error.meta)
            console.error('Meta:', JSON.stringify(error.meta, null, 2));
        console.error('--------------------------');
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
