import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
@Component({selector:'app-sin-acceso',templateUrl:'./sin-acceso.html'})
export class SinAcceso { readonly auth=inject(AuthService); }
