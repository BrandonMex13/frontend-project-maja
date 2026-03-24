import { Component, input, output } from '@angular/core';
import { ActividadPrincipal, textoEstado } from '../../models/todo-lista.modelos';

@Component({
    selector: 'app-todo-list-card-component',
    imports: [],
    templateUrl: './todo-list-card.component.html',
})
export class TodoListCardComponent {
    readonly actividad = input.required<ActividadPrincipal>();
    readonly seleccionada = input(false);
    readonly alSeleccionar = output<ActividadPrincipal>();
    readonly alEliminar = output<ActividadPrincipal>();

    protected readonly textoEstado = textoEstado;

    seleccionar(): void {
        this.alSeleccionar.emit(this.actividad());
    }

    eliminar(evento: Event): void {
        evento.stopPropagation();
        this.alEliminar.emit(this.actividad());
    }
}
