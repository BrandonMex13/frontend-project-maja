import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./core/pages/home/home.component').then(c => c.HomeComponent),
        children: [
            {
                path: 'todo-list',
                loadComponent: () => import('./todo-list/pages/todo-list/todo-list.component').then(c => c.TodoListComponent)
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];