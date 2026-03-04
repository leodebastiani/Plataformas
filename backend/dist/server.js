"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || 'file:./dev.db',
        },
    },
});
// Enable foreign key constraints for SQLite (commented out for PostgreSQL/Supabase)
// prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON;').catch(console.error);
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const sector_routes_1 = __importDefault(require("./routes/sector.routes"));
const platform_routes_1 = __importDefault(require("./routes/platform.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const sector_controller_1 = require("./controllers/sector.controller");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/sectors', sector_routes_1.default);
app.use('/api/platforms', platform_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.get('/', (req, res) => {
    res.send('Platform Management System API');
});
async function seedUsers() {
    const existing = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
    if (!existing) {
        const hashed = await bcryptjs_1.default.hash('password123', 10);
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
(0, sector_controller_1.seedSectors)()
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
