import { Routes } from '@angular/router';
import { Acercade } from './components/acercade/acercade';
import { Contabilidad } from './components/contabilidad/contabilidad';
import { Compras } from './components/compras/compras';
import { Ventas } from './components/ventas/ventas';
import { Inventario } from './components/inventario/inventario';
import { Rrhh } from './components/rrhh/rrhh';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { SinAcceso } from './components/sin-acceso/sin-acceso';
import { authGuard } from './core/auth/auth.guard';
import { permissionsGuard } from './core/auth/permissions.guard';
const admin={canActivate:[authGuard,permissionsGuard],data:{roles:['administrador']}};
export const routes: Routes = [
 {path:'',pathMatch:'full',redirectTo:'login'},
 {path:'login',component:Login},
 {path:'home',component:Home,...admin},
 {path:'sin-acceso',component:SinAcceso,canActivate:[authGuard]},
 {path:'ventas',component:Ventas,...admin},
 {path:'compras',component:Compras,...admin},
 {path:'inventario',component:Inventario,...admin},
 {path:'rrhh',component:Rrhh,...admin},
 {path:'contabilidad',component:Contabilidad,...admin},
 {path:'acercade',component:Acercade,...admin},
 {path:'**',redirectTo:'login'}
];
