export type EstadoActividadPrincipal =
    | 'abierta'
    | 'en_progreso'
    | 'completada'
    | 'cancelada';

export interface ProgresoResumen {
    hechas: number;
    total: number;
    porcentaje: number;
}

export interface UsuarioAsignado {
    id: number;
    nombre: string;
    correo: string;
}

export interface SubActividad {
    id: number;
    titulo: string;
    descripcion: string | null;
    completada: boolean;
    orden: number;
    actividadPrincipalId: number;
    creadoEn: string;
    actualizadoEn: string;
}

export interface ActividadPrincipal {
    id: number;
    titulo: string;
    descripcion: string | null;
    usuarioAsignadoId: number;
    usuarioAsignado: UsuarioAsignado;
    estado: EstadoActividadPrincipal;
    subActividades: SubActividad[];
    progreso: ProgresoResumen;
    creadoEn: string;
    actualizadoEn: string;
}

export interface UsuarioParaAsignacion {
    id: number;
    nombre: string;
    correo: string;
}

export function textoEstado(estado: EstadoActividadPrincipal): string {
    const map: Record<EstadoActividadPrincipal, string> = {
        abierta: 'Abierta',
        en_progreso: 'En progreso',
        completada: 'Completada',
        cancelada: 'Cancelada',
    };
    return map[estado];
}
