import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { of, firstValueFrom, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { authGuard } from './auth.guard';
import { permissionsGuard } from './permissions.guard';
describe('Guardianes',()=>{
 const state={} as RouterStateSnapshot;
 function setup(token:string|null,rol:string){TestBed.configureTestingModule({providers:[provideRouter([]),{provide:AuthService,useValue:{token:()=>token,verify:()=>of({usuario:{rol}})}}]});}
 it('envía a login sin token',()=>{
  setup(null,'');const result=TestBed.runInInjectionContext(()=>authGuard({} as ActivatedRouteSnapshot,state));
  expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/login');
 });
 it('cajero recibe sin-acceso',async()=>{
  setup('token','cajero');const result=await firstValueFrom(TestBed.runInInjectionContext(()=>permissionsGuard({data:{roles:['administrador']}} as unknown as ActivatedRouteSnapshot,state)) as Observable<UrlTree>);
  expect(TestBed.inject(Router).serializeUrl(result)).toBe('/sin-acceso');
 });
 it('permite al administrador verificado',async()=>{
  setup('token','administrador');const result=await firstValueFrom(TestBed.runInInjectionContext(()=>permissionsGuard({data:{roles:['administrador']}} as unknown as ActivatedRouteSnapshot,state)) as Observable<boolean>);
  expect(result).toBe(true);
 });
});
