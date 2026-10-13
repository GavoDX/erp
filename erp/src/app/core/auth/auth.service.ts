import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_BASE_URL } from '../api-config';
export interface Usuario { id:number; nombre:string; correo:string; rol:'administrador'|'cajero'; estado:string; }
interface Sesion { token:string; usuario:Usuario; expiresAt:number; }
@Injectable({providedIn:'root'})
export class AuthService {
 private http = inject(HttpClient);
 private router = inject(Router);
 readonly usuario = signal<Usuario|null>(null);
 private tokenValue:string|null = null;
 private timer?:ReturnType<typeof setTimeout>;
 constructor() {
  try {
   const saved = sessionStorage.getItem('elgrano-sesion');
   if (saved) { const data:Sesion = JSON.parse(saved); if (typeof data.token === 'string' && data.expiresAt > Date.now()) this.save(data); else this.clear(); }
  } catch { this.clear(); }
 }
 token() { return this.tokenValue; }
 private save(data:Sesion) {
  this.tokenValue=data.token; this.usuario.set(data.usuario);
  sessionStorage.setItem('elgrano-sesion',JSON.stringify(data));
  clearTimeout(this.timer);
  this.timer=setTimeout(()=>this.expired(),Math.min(data.expiresAt-Date.now(),2147483647));
 }
 login(correo:string,password:string) { return this.http.post<Sesion>(`${API_BASE_URL}/auth/login`,{correo,password}).pipe(tap(data=>this.save(data))); }
 verify() { return this.http.get<{usuario:Usuario}>(`${API_BASE_URL}/auth/me`).pipe(tap(data=>this.usuario.set(data.usuario))); }
 logout() { return this.http.post(`${API_BASE_URL}/auth/logout`,{}).pipe(tap(()=>{this.clear(); void this.router.navigate(['/login']);})); }
 clear() { this.tokenValue=null; this.usuario.set(null); clearTimeout(this.timer); sessionStorage.removeItem('elgrano-sesion'); }
 expired() { this.clear(); void this.router.navigate(['/login'],{queryParams:{sesion:'vencida'}}); }
}
