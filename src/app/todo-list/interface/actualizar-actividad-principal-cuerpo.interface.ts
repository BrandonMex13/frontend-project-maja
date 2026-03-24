import { EstadoActividadPrincipal } from "../models/todo-lista.modelos";

export interface ActualizarActividadPrincipalCuerpoInterface {
    titulo?: string;
    descripcion?: string;
    idUsuarioAsignado?: number;
    estado?: EstadoActividadPrincipal;
}
