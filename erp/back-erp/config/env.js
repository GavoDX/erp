import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });
export const dbConfig = {
 host: process.env.DB_HOST || '127.0.0.1', port: Number(process.env.DB_PORT || 3306),
 user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '',
 database: process.env.DB_NAME || 'erp_autenticacion',
};
export function authConfig() {
 const secret = process.env.JWT_SECRET;
 if (!secret || secret.length < 32) throw new Error('Configura JWT_SECRET con al menos 32 caracteres en back-erp/.env.');
 return { secret, expiresIn: process.env.JWT_EXPIRES_IN || '30m' };
}
