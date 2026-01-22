const { Client } = require('pg');
require('dotenv').config();

async function testRaw() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('Connecting to:', process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@'));
        await client.connect();
        console.log('--- RAW CONNECTION SUCCESSFUL ---');
        const res = await client.query('SELECT NOW()');
        console.log('Current Time:', res.rows[0].now);
    } catch (err) {
        console.error('--- RAW CONNECTION FAILED ---');
        console.error(err);
    } finally {
        await client.end();
    }
}

testRaw();
