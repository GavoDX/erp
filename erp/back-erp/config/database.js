import mysql from 'mysql2/promise';
import { dbConfig } from './env.js';
export const pool = mysql.createPool({ ...dbConfig, connectionLimit: 10 });
