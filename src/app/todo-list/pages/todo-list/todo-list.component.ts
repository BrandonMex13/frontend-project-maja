import { Component } from '@angular/core';
import { TodoListCardComponent } from "../../components/todo-list-card/todo-list-card.component";

@Component({
  selector: 'app-todo-list-component',
  imports: [TodoListCardComponent],
  templateUrl: './todo-list.component.html',
})
export class TodoListComponent {}
