import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authRoutes } from './routes/auth.routes.js';
import { demoRoutes } from './routes/demo.routes.js';
import { authenticate, authorize } from './middleware/auth.js';
export function createApp(service, health = async () => {}) {
 const app = express();
 app.disable('x-powered-by');
 app.use(helmet());
 app.use(cors({origin:process.env.FRONTEND_ORIGIN || 'http://localhost:4200'}));
 app.use(express.json({limit:'16kb'}));
 app.use('/api',(_req,res,next) => { res.set('Cache-Control','no-store'); next(); });
 app.get('/api/health',async(req,res) => { await health(); res.json({status:'ok',db:'conectada'}); });
 app.use('/api/auth',authRoutes(service));
 app.use('/api',authenticate(service),authorize('administrador'),demoRoutes());
 app.use((_req,res) => res.status(404).json({error:'Ruta no encontrada.'}));
 app.use((err,_req,res,_next) => {
  const status = err.status || 500;
  if (status >= 500) console.error('Error de API:',err.code || err.message);
  res.status(status).json({error: status >= 500 ? 'No se pudo completar la operación. Revisa la conexión del servidor con MySQL.' : status === 400 && err.type === 'entity.parse.failed' ? 'JSON inválido.' : err.message});
 });
 return app;
}
