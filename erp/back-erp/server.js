import { pool } from './config/database.js';
import { authConfig } from './config/env.js';
import { usuarioModel } from './models/usuario.model.js';
import { authService } from './services/auth.service.js';
import { createApp } from './app.js';
const app = createApp(authService(usuarioModel(pool),authConfig()),() => pool.query('SELECT 1'));
const server = app.listen(Number(process.env.PORT || 3000),() => console.log('API El Grano disponible en http://localhost:'+(process.env.PORT || 3000)));
for (const signal of ['SIGINT','SIGTERM']) process.on(signal,() => server.close(async() => { await pool.end(); process.exit(0); }));
