import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
@Component({selector:'app-login',imports:[FormsModule],templateUrl:'./login.html'})
export class Login {
 private auth=inject(AuthService); private router=inject(Router); private route=inject(ActivatedRoute);
 correo=''; password=''; readonly busy=signal(false); readonly error=signal('');
 readonly aviso=this.route.snapshot.queryParamMap.get('sesion')==='vencida' ? 'Tu sesión terminó. Inicia sesión nuevamente.' : this.route.snapshot.queryParamMap.get('sesion')==='conexion' ? 'No fue posible verificar tu sesión. Revisa que la API esté encendida.' : '';
 submit() {
  if (this.busy()) return;
  this.busy.set(true); this.error.set('');
  this.auth.login(this.correo,this.password).subscribe({next:data=>{this.busy.set(false);this.password='';void this.router.navigate([data.usuario.rol==='administrador'?'/home':'/sin-acceso']);},error:e=>{this.busy.set(false);this.error.set(e.error?.error || 'No hay conexión con el servidor. Revisa que la API esté encendida.');}});
 }
}
