import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { TodoListCardComponent } from '../../components/todo-list-card/todo-list-card.component';
import { ActividadPrincipal, EstadoActividadPrincipal, textoEstado, UsuarioParaAsignacion } from '../../models/todo-lista.modelos';
import { ActividadesApiService } from '../../services/actividades-api.service';
import { UsuariosApiService } from '../../services/usuarios-api.service';
import Swal from 'sweetalert2'

@Component({
    selector: 'app-todo-list-component',
    imports: [TodoListCardComponent, FormsModule],
    templateUrl: './todo-list.component.html',
})
export class TodoListComponent implements OnInit {
    private readonly actividadesApi = inject(ActividadesApiService);
    private readonly usuariosApi = inject(UsuariosApiService);
    private readonly auth = inject(AuthService);

    readonly actividades = signal<ActividadPrincipal[]>([]);
    readonly usuarios = signal<UsuarioParaAsignacion[]>([]);
    readonly textoBusqueda = signal('');
    readonly actividadSeleccionada = signal<ActividadPrincipal | null>(null);
    readonly cargando = signal(false);
    readonly error = signal<string | null>(null);
    readonly guardandoSub = signal(false);

    readonly actividadesFiltradas = computed(() => {
        const q = this.textoBusqueda().trim().toLowerCase();
        const lista = this.actividades();
        if (!q) {
            return lista;
        }
        return lista.filter(
            (a) =>
                a.titulo.toLowerCase().includes(q) ||
                (a.descripcion ?? '').toLowerCase().includes(q) ||
                a.usuarioAsignado.nombre.toLowerCase().includes(q),
        );
    });

    readonly sinActividades = computed(() => this.actividades().length === 0);

    tituloNuevo = '';
    descripcionNueva = '';
    idUsuarioAsignado: number | null = null;
    tituloSubNueva = '';

    protected readonly textoEstado = textoEstado;
    protected readonly estados: EstadoActividadPrincipal[] = [
        'abierta',
        'en_progreso',
        'completada',
        'cancelada',
    ];

    ngOnInit(): void {
        this.cargarUsuarios();
        this.cargarActividades();
    }

    cerrarSesion(): void {
        this.auth.cerrarSesion();
    }

    cargarUsuarios(): void {
        this.usuariosApi.listarParaAsignacion().subscribe({
            next: (u) => this.usuarios.set(u),
            error: () =>
                this.error.set('No se pudieron cargar los usuarios. ¿Está el backend en marcha?'),
        });
    }

    cargarActividades(): void {
        this.cargando.set(true);
        this.actividadesApi.listarActividadesPrincipales().subscribe({
            next: (lista) => {
                this.actividades.set(lista);
                this.cargando.set(false);
                const sel = this.actividadSeleccionada();
                if (sel) {
                    const actual = lista.find((a) => a.id === sel.id) ?? null;
                    this.actividadSeleccionada.set(actual);
                }
            },
            error: (err: HttpErrorResponse) => {
                this.cargando.set(false);
                this.error.set(this.mensajeHttp(err, 'No se pudieron cargar las actividades.'));
            },
        });
    }

    crearActividadPrincipal(): void {
        const titulo = this.tituloNuevo.trim();
        if (!titulo) {
            this.error.set('El título de la actividad principal es obligatorio.');
            return;
        }
        if (this.idUsuarioAsignado == null) {
            this.error.set('Tenés que elegir un usuario asignado.');
            return;
        }
        this.error.set(null);
        this.actividadesApi
            .crearActividadPrincipal({
                titulo,
                descripcion: this.descripcionNueva.trim() || undefined,
                idUsuarioAsignado: this.idUsuarioAsignado,
            })
            .subscribe({
                next: () => {
                    this.tituloNuevo = '';
                    this.descripcionNueva = '';
                    this.idUsuarioAsignado = null;
                    this.cargarActividades();
                },
                error: (err: HttpErrorResponse) => {
                    this.error.set(this.mensajeHttp(err, 'No se pudo crear la actividad.'));
                },
            });
    }

    seleccionarActividad(act: ActividadPrincipal): void {
        this.actividadSeleccionada.set(act);
    }

    eliminarActividad(act: ActividadPrincipal): void {
        Swal.fire({
            title: `¿Seguro que querés eliminar "${act.titulo}"? Se borrarán también las sub-actividades.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar"
        }).then((result: any) => {
            this.actividadesApi.eliminarActividadPrincipal(act.id).subscribe({
                next: () => {
                    if (this.actividadSeleccionada()?.id === act.id) {
                        this.actividadSeleccionada.set(null);
                    }
                    this.cargarActividades();
                },
                error: (err: HttpErrorResponse) => {
                    this.error.set(this.mensajeHttp(err, 'No se pudo eliminar la actividad.'));
                },
            });

            if (result.isConfirmed) Swal.fire({
                title: "Actividad eliminada",
                icon: "success"
            });
        });
    }

    cambiarEstadoPrincipal(valor: string): void {
        const sel = this.actividadSeleccionada();
        if (!sel) {
            return;
        }
        const nuevo = valor as EstadoActividadPrincipal;
        if (sel.estado === nuevo) {
            return;
        }
        this.actividadesApi.actualizarActividadPrincipal(sel.id, { estado: nuevo }).subscribe({
            next: () => this.cargarActividades(),
            error: (err: HttpErrorResponse) => {
                this.error.set(this.mensajeHttp(err, 'No se pudo actualizar el estado.'));
            },
        });
    }

    agregarSubActividad(): void {
        const sel = this.actividadSeleccionada();
        const titulo = this.tituloSubNueva.trim();
        if (!sel || !titulo) {
            return;
        }
        this.guardandoSub.set(true);
        this.actividadesApi.crearSubActividad(sel.id, { titulo }).subscribe({
            next: () => {
                this.tituloSubNueva = '';
                this.guardandoSub.set(false);
                this.cargarActividades();
            },
            error: (err: HttpErrorResponse) => {
                this.guardandoSub.set(false);
                this.error.set(this.mensajeHttp(err, 'No se pudo crear la sub-actividad.'));
            },
        });
    }

    alternarSubActividad(id: number, completada: boolean): void {
        this.actividadesApi.actualizarSubActividad(id, { completada }).subscribe({
            next: () => this.cargarActividades(),
            error: (err: HttpErrorResponse) => {
                this.error.set(this.mensajeHttp(err, 'No se pudo actualizar la sub-actividad.'));
            },
        });
    }

    eliminarSubActividad(id: number): void {
        Swal.fire({
            title: '¿Eliminar esta sub-actividad?',
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar"
        }).then(() => {
            this.actividadesApi.eliminarSubActividad(id).subscribe({
                next: () => {
                    this.cargarActividades();

                    Swal.fire({
                        title: "Actividad eliminada",
                        icon: "success"
                    });
                },
                error: (err: HttpErrorResponse) => {
                    this.error.set(this.mensajeHttp(err, 'No se pudo eliminar la sub-actividad.'));
                    Swal.fire({
                        title: "No se pudo eliminar la sub-actividad",
                        icon: "error"
                    });
                },
            });

        });
    }

    private mensajeHttp(err: HttpErrorResponse, fallback: string): string {
        const raw = err.error?.message ?? err.message;
        if (Array.isArray(raw)) {
            return raw.join(', ');
        }
        if (typeof raw === 'string' && raw.length > 0) {
            return raw;
        }
        return fallback;
    }
}
