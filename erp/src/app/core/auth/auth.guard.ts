import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';
export const authGuard:CanActivateFn = () => {
 const auth=inject(AuthService), router=inject(Router);
 if (!auth.token()) return router.createUrlTree(['/login']);
 return auth.verify().pipe(map(()=>true),catchError(error=>of(router.createUrlTree(['/login'],{queryParams:{sesion:error.status===401?'vencida':'conexion'}}))));
};
