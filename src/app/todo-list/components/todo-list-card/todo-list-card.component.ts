import { Component } from '@angular/core';

@Component({
  selector: 'app-todo-list-card-component',
  imports: [],
  templateUrl: './todo-list-card.component.html',
})
export class TodoListCardComponent {
  items = Array(5);
}
