import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createApp } from '../app.js';
import { authService } from '../services/auth.service.js';
const config={secret:'test-only-secret-012345678901234567890123456789',expiresIn:'30m'};
let server,base,users;
before(async()=>{
 users=[{id:1,nombre:'Administrador',correo:'admin@elgrano.com',rol:'administrador',estado:'activo',session_version:0,password_hash:await bcrypt.hash('Admin123!',4)},
 {id:2,nombre:'Cajero',correo:'cajero@elgrano.com',rol:'cajero',estado:'activo',session_version:0,password_hash:await bcrypt.hash('Cajero123!',4)}];
 const repo={byEmail:async correo=>users.find(u=>u.correo===correo),byId:async id=>users.find(u=>u.id===id),revoke:async id=>{users.find(u=>u.id===id).session_version++;}};
 server=createApp(authService(repo,config)).listen(0,'127.0.0.1');
 await new Promise(resolve=>server.once('listening',resolve));
 base=`http://127.0.0.1:${server.address().port}/api`;
});
after(()=>new Promise(resolve=>server.close(resolve)));
async function request(path,token,body){
 const res=await fetch(base+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});
 return {status:res.status,body:await res.json()};
}
const login=(correo='admin@elgrano.com',password='Admin123!')=>request('/auth/login',null,{correo,password});
test('login de administrador devuelve JWT y solo datos públicos',async()=>{
 const r=await login();assert.equal(r.status,200);assert.equal(r.body.usuario.rol,'administrador');assert.ok(r.body.expiresAt>Date.now());
 assert.deepEqual(Object.keys(r.body.usuario).sort(),['correo','estado','id','nombre','rol']);
 const home=await request('/auth/home',r.body.token);assert.equal(home.status,200);
});
test('cajero inicia sesión, consulta sus datos, pero no accede a home ni módulos',async()=>{
 const r=await login('cajero@elgrano.com','Cajero123!');assert.equal(r.status,200);
 assert.equal((await request('/auth/me',r.body.token)).body.usuario.rol,'cajero');
 for(const path of ['/auth/home','/ventas/productos','/inventario/insumos','/rrhh/empleados','/compras/ordenes','/contabilidad/movimientos'])assert.equal((await request(path,r.body.token)).status,403);
});
test('rechaza contraseña incorrecta y cuenta inexistente',async()=>{
 assert.equal((await login('admin@elgrano.com','incorrecta')).status,401);assert.equal((await login('nadie@elgrano.com','incorrecta')).status,401);
});
test('valida campos y correo antes de consultar',async()=>{
 assert.equal((await request('/auth/login',null,{})).status,400);
 assert.equal((await login("' OR 1=1 --",'incorrecta')).status,400);
});
test('API protegida rechaza llamadas sin token',async()=>{
 assert.equal((await request('/auth/me')).status,401);assert.equal((await request('/ventas/productos')).status,401);
});
test('rechaza JWT alterado',async()=>{
 const {body}=await login();const parts=body.token.split('.');parts[1]=Buffer.from(JSON.stringify({sub:'2',version:0})).toString('base64url');
 assert.equal((await request('/auth/me',parts.join('.'))).status,401);
});
test('rechaza JWT vencido',async()=>{
 const token=jwt.sign({version:0},config.secret,{subject:'1',issuer:'el-grano-api',audience:'el-grano-angular',expiresIn:-1});
 assert.equal((await request('/auth/me',token)).status,401);
});
test('logout invalida el token también en el servidor',async()=>{
 const {body}=await login();assert.equal((await request('/auth/logout',body.token,{})).status,200);
 assert.equal((await request('/auth/me',body.token)).status,401);
});
test('cambio de rol se aplica a tokens ya emitidos',async()=>{
 const {body}=await login();users[0].rol='cajero';
 try{assert.equal((await request('/auth/home',body.token)).status,403);}finally{users[0].rol='administrador';}
});
test('cuenta inactiva no puede iniciar ni conservar sesión',async()=>{
 const {body}=await login();users[0].estado='inactivo';
 try{assert.equal((await login()).status,401);assert.equal((await request('/auth/me',body.token)).status,401);}finally{users[0].estado='activo';}
});
test('venta demo recalcula el total e ignora precios manipulados',async()=>{
 const {body}=await login();const result=await request('/ventas/facturas',body.token,{metodo:'Efectivo',total:0,items:[{nombre:'Latte Grande',precioUnitario:0,cantidad:2}]});
 assert.equal(result.status,201);assert.equal(result.body.total,81);
 assert.equal((await request('/ventas/facturas',body.token,{metodo:'Efectivo',items:[{nombre:'Latte Grande',cantidad:-2}]})).status,400);
});
