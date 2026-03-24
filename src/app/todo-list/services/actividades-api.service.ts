import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActividadPrincipal, EstadoActividadPrincipal, SubActividad } from '../models/todo-lista.modelos';
import { CrearActividadPrincipalCuerpoInterface } from '../interface/crear-actividad-principal-cuerpo.interface';
import { ActualizarActividadPrincipalCuerpoInterface } from '../interface/actualizar-actividad-principal-cuerpo.interface';
import { CrearSubActividadCuerpoInterface } from '../interface/crear-sub-actividad-cuerpo.interface';
import { ActualizarSubActividadCuerpoInterface } from '../interface/actualizar-sub-actividad-cuerpo.interface';

@Injectable({ providedIn: 'root' })
export class ActividadesApiService {
    private readonly http = inject(HttpClient);
    private readonly base = `${environment.apiUrl}/todo`;

    listarActividadesPrincipales(idUsuarioAsignado?: number): Observable<ActividadPrincipal[]> {
        return this.http.get<ActividadPrincipal[]>(
            `${this.base}/actividades-principales`,
            idUsuarioAsignado != null
                ? { params: { idUsuarioAsignado: String(idUsuarioAsignado) } }
                : {},
        );
    }

    obtenerActividadPrincipal(id: number): Observable<ActividadPrincipal> {
        return this.http.get<ActividadPrincipal>(`${this.base}/actividades-principales/${id}`);
    }

    crearActividadPrincipal(cuerpo: CrearActividadPrincipalCuerpoInterface): Observable<ActividadPrincipal> {
        return this.http.post<ActividadPrincipal>(`${this.base}/actividades-principales`, cuerpo);
    }

    actualizarActividadPrincipal(
        id: number,
        cuerpo: ActualizarActividadPrincipalCuerpoInterface,
    ): Observable<ActividadPrincipal> {
        return this.http.patch<ActividadPrincipal>(`${this.base}/actividades-principales/${id}`, cuerpo);
    }

    eliminarActividadPrincipal(id: number): Observable<void> {
        return this.http.delete<void>(`${this.base}/actividades-principales/${id}`);
    }

    listarSubActividades(actividadPrincipalId: number): Observable<SubActividad[]> {
        return this.http.get<SubActividad[]>(
            `${this.base}/actividades-principales/${actividadPrincipalId}/sub-actividades`,
        );
    }

    crearSubActividad(
        actividadPrincipalId: number,
        cuerpo: CrearSubActividadCuerpoInterface,
    ): Observable<SubActividad> {
        return this.http.post<SubActividad>(
            `${this.base}/actividades-principales/${actividadPrincipalId}/sub-actividades`,
            cuerpo,
        );
    }

    actualizarSubActividad(id: number, cuerpo: ActualizarSubActividadCuerpoInterface): Observable<SubActividad> {
        return this.http.patch<SubActividad>(`${this.base}/sub-actividades/${id}`, cuerpo);
    }

    eliminarSubActividad(id: number): Observable<void> {
        return this.http.delete<void>(`${this.base}/sub-actividades/${id}`);
    }
}
