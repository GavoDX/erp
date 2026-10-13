import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { rateLimit } from 'express-rate-limit';
export function authRoutes(service) {
 const router = Router();
 router.post('/login',rateLimit({windowMs:15*60*1000,limit:20,standardHeaders:'draft-7',legacyHeaders:false,skipSuccessfulRequests:true,message:{error:'Demasiados intentos. Espera 15 minutos.'}}),async(req,res) => {
  res.json(await service.login(req.body?.correo,req.body?.password));
 });
 router.use(authenticate(service));
 router.get('/me',(req,res) => res.json({usuario:req.usuario}));
 router.post('/logout',async(req,res) => { await service.logout(req.usuario.id); res.json({message:'Sesiones cerradas.'}); });
 router.get('/home',authorize('administrador'),(req,res) => res.json({message:`Bienvenido, ${req.usuario.nombre}`,usuario:req.usuario}));
 return router;
}
