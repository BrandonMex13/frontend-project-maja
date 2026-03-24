import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UsuarioParaAsignacion } from '../models/todo-lista.modelos';

@Injectable({ providedIn: 'root' })
export class UsuariosApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/users`;

  listarParaAsignacion(): Observable<UsuarioParaAsignacion[]> {
    return this.http.get<UsuarioParaAsignacion[]>(`${this.base}/para-asignacion`);
  }
}
