import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
export const authInterceptor:HttpInterceptorFn = (req,next) => {
 const auth=inject(AuthService);
 const secured=req.url.startsWith('/api/') && !req.url.endsWith('/auth/login');
 const token=auth.token();
 if (secured && token) req=req.clone({setHeaders:{Authorization:`Bearer ${token}`}});
 return next(req).pipe(catchError(error=>{
  if (secured && error.status===401) auth.expired();
  return throwError(()=>error);
 }));
};
