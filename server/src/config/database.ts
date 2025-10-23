import postgres from 'postgres';
import { DATABASE_URL, DATABASE_SSL } from '@/utils/env.js';

const sql = postgres(DATABASE_URL,{
    ssl: DATABASE_SSL ? {
        rejectUnauthorized: false
    } : false
});

export default sql;

export const connectDB = async () => {
	try {
		const result = await sql`SELECT version()`;
		const regex = /PostgreSQL (\d+\.\d+(?:\.\d+)?)/;
		const version = result[0].version.match(regex);

		console.log(`✅ PostgreSQL Connected! at version ${version[1]}`);
	} catch (error) {
		console.error('❌ Database Connection Error:', error);
		process.exit(1);
	}
};