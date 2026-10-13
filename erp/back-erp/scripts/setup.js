import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { readFile, writeFile, access } from 'node:fs/promises';
const envFile = new URL('../.env', import.meta.url);
try { await access(envFile); } catch {
 const example = await readFile(new URL('../.env.example', import.meta.url), 'utf8');
 await writeFile(envFile, example.replace('JWT_SECRET=', `JWT_SECRET=${randomBytes(48).toString('hex')}`));
}
let envText = await readFile(envFile, 'utf8');
if (!/^JWT_SECRET=.{32,}$/m.test(envText)) {
 const line = `JWT_SECRET=${randomBytes(48).toString('hex')}`;
 envText = /^JWT_SECRET=.*$/m.test(envText) ? envText.replace(/^JWT_SECRET=.*$/m,line) : envText+'\n'+line+'\n';
 await writeFile(envFile,envText);
}
const { dbConfig } = await import('../config/env.js');
if (!/^[a-zA-Z0-9_]+$/.test(dbConfig.database)) throw new Error('DB_NAME inválido.');
const { database, ...connection } = dbConfig;
const db = await mysql.createConnection(connection);
try {
 await db.query('CREATE DATABASE IF NOT EXISTS `'+database+'` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
 await db.query('USE `'+database+'`');
 await db.query(await readFile(new URL('../database/schema.sql', import.meta.url), 'utf8'));
 for (const [nombre, correo, password, rol] of [
  ['Gabriel Emiliano Gonzalez Camacho','admin@elgrano.com','Admin123!','administrador'],
  ['Cajero de demostración','cajero@elgrano.com','Cajero123!','cajero'],
 ]) {
  const [existing] = await db.execute('SELECT id FROM usuarios WHERE correo = ?', [correo]);
  if (!existing.length) await db.execute('INSERT INTO usuarios (nombre,correo,password_hash,rol) VALUES (?,?,?,?)', [nombre,correo,await bcrypt.hash(password,12),rol]);
 }
 console.log('Base preparada: una tabla usuarios y dos cuentas de demostración. No se modificaron cuentas existentes.');
} finally { await db.end(); }
