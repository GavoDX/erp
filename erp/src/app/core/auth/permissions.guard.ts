import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';
export const permissionsGuard:CanActivateFn = route => {
 const auth=inject(AuthService), router=inject(Router);
 if (!auth.token()) return router.createUrlTree(['/login']);
 // Se consulta al servidor; modificar el rol en el navegador no concede permisos.
 return auth.verify().pipe(map(({usuario})=>
  (route.data?.['roles'] as string[] || []).includes(usuario.rol) ? true : router.createUrlTree(['/sin-acceso'])),
  catchError(error=>of(router.createUrlTree(['/login'],{queryParams:{sesion:error.status===401?'vencida':'conexion'}}))));
};
