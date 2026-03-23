import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UsuarioSesionInterface } from '../interface/usuario-sesion.interface';
import { RespuestaLoginInterface } from '../interface/respuesta-login.interface';

const CLAVE_TOKEN = environment.CLAVE_TOKEN;

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    private readonly platformId = inject(PLATFORM_ID);

    iniciarSesion(correo: string, contrasena: string): Observable<RespuestaLoginInterface> {
        return this.http
            .post<RespuestaLoginInterface>(`${environment.apiUrl}/auth/login`, {
                email: correo,
                password: contrasena,
            })
            .pipe(
                tap((resp) => {
                    if (isPlatformBrowser(this.platformId)) {
                        localStorage.setItem(CLAVE_TOKEN, resp.access_token);
                    }
                }),
            );
    }

    cerrarSesion(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(CLAVE_TOKEN);
        }
        void this.router.navigate(['/login']);
    }

    obtenerToken(): string | null {
        if (!isPlatformBrowser(this.platformId)) {
            return null;
        }
        return localStorage.getItem(CLAVE_TOKEN);
    }

    tieneSesion(): boolean {
        return !!this.obtenerToken();
    }
}
