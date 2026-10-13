import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
@Component({selector:'app-root',imports:[RouterOutlet,RouterLink,RouterLinkActive],templateUrl:'./app.html',styleUrl:'./app.css'})
export class App {
 readonly auth=inject(AuthService); readonly error=signal(''); readonly closing=signal(false);
 logout(){ if(this.closing())return; this.error.set(''); this.closing.set(true); this.auth.logout().subscribe({next:()=>this.closing.set(false),error:e=>{this.closing.set(false);if(e.status!==401)this.error.set('No se pudo cerrar la sesión en el servidor. Revisa la conexión e inténtalo otra vez.');}}); }
}
