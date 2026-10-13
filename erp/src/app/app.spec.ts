import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app';
describe('App',()=>{
 beforeEach(()=>{sessionStorage.clear();TestBed.configureTestingModule({imports:[App],providers:[provideRouter([]),provideHttpClient()]});});
 it('oculta módulos y cierre de sesión cuando no hay sesión',async()=>{
  const fixture=TestBed.createComponent(App);await fixture.whenStable();
  const html=fixture.nativeElement as HTMLElement;
  expect(html.textContent).toContain('EL GRANO');expect(html.querySelector('nav')).toBeNull();expect(html.textContent).not.toContain('Cerrar sesión');
 });
});
