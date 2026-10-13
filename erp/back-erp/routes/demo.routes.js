import { Router } from 'express';
import { fail } from '../services/auth.service.js';
export function demoRoutes() {
 const r = Router();
 const productos = [
  {id:1,nombre:'Latte Grande',precio:45,categoria:'Bebidas calientes'},
  {id:2,nombre:'Cappuccino',precio:42,categoria:'Bebidas calientes'},
  {id:3,nombre:'Espresso Doble',precio:35,categoria:'Bebidas calientes'},
  {id:4,nombre:'Frappé Moka',precio:52,categoria:'Bebidas frías'},
  {id:5,nombre:'Té Chai',precio:38,categoria:'Bebidas calientes'},
  {id:6,nombre:'Agua Mineral',precio:20,categoria:'Bebidas frías'},
  {id:7,nombre:'Muffin Arándano',precio:30,categoria:'Alimentos'},
  {id:8,nombre:'Croissant',precio:28,categoria:'Alimentos'},
  {id:9,nombre:'Cheesecake',precio:48,categoria:'Postres'},
 ];
 const facturas = [];
 r.get('/ventas/productos',(_q,s)=>s.json(productos));
 r.get('/ventas/facturas',(_q,s)=>s.json(facturas));
 r.post('/ventas/facturas',(q,s)=>{
  const {items,metodo} = q.body || {};
  if (!Array.isArray(items) || !items.length || items.length > 100 || !['Efectivo','Tarjeta','Transferencia'].includes(metodo)) throw fail(400,'Pedido inválido.');
  let subtotal = 0;
  for (const item of items) {
   const product = productos.find(p=>p.nombre===item?.nombre);
   if (!product || !Number.isInteger(item.cantidad) || item.cantidad < 1 || item.cantidad > 100) throw fail(400,'Producto o cantidad inválidos.');
   subtotal += product.precio * item.cantidad;
  }
  const id = facturas.length + 1;
  const factura = {id,folio:`DEMO-${id}`,cliente:'Consumidor final',fecha:new Date().toISOString().slice(0,10),total:Math.round(subtotal*90)/100,metodo};
  facturas.unshift(factura); s.status(201).json(factura);
 });
 r.get('/inventario/insumos',(_q,s)=>s.json([
  {nombre:'Leche entera',categoria:'Lácteos',stockActual:8.5,stockMinimo:5,unidad:'L',valorUnitario:22},
  {nombre:'Café en grano - Blend',categoria:'Café',stockActual:3.2,stockMinimo:5,unidad:'kg',valorUnitario:320},
  {nombre:'Vasos desechables 16oz',categoria:'Empaque',stockActual:620,stockMinimo:300,unidad:'pz',valorUnitario:1.5},
  {nombre:'Jarabe de vainilla',categoria:'Insumos',stockActual:1.1,stockMinimo:2,unidad:'L',valorUnitario:180}
 ]));
 r.get('/compras/proveedores',(_q,s)=>s.json([
  {nombre:'Distribuidora Café Sur',contacto:'ventas@cafesur.mx',categoria:'Café'},
  {nombre:'Lácteos del Valle',contacto:'pedidos@lactosvalle.mx',categoria:'Lácteos'}
 ]));
 r.get('/compras/ordenes',(_q,s)=>s.json([
  {orden:'OC-1042',proveedor:'Distribuidora Café Sur',insumos:'Café y jarabe',fecha:'2026-09-01',total:4850,estado:'Pendiente'},
  {orden:'OC-1041',proveedor:'Lácteos del Valle',insumos:'Leche entera',fecha:'2026-08-30',total:2120,estado:'Recibida'}
 ]));
 r.get('/contabilidad/movimientos',(_q,s)=>s.json([
  {fecha:'2026-09-01',concepto:'Venta del día',categoria:'Ventas',tipo:'Ingreso',monto:8420.5},
  {fecha:'2026-09-01',concepto:'Pago de nómina',categoria:'Nómina',tipo:'Egreso',monto:12500},
  {fecha:'2026-08-30',concepto:'Compra de leche',categoria:'Compras',tipo:'Egreso',monto:2120}
 ]));
 r.get('/rrhh/empleados',(_q,s)=>s.json([
  {nombre:'Ana Martínez',puesto:'Cajero',turno:'Matutino · 07:00–15:00',estado:'Activo'},
  {nombre:'Diego Ruiz',puesto:'Barista',turno:'Matutino · 07:00–15:00',estado:'Activo'},
  {nombre:'Iván Castro',puesto:'Cajero',turno:'Vespertino · 15:00–23:00',estado:'En descanso'}
 ]));
 return r;
}
