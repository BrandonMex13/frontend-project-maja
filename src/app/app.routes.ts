import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./core/pages/login/login.component').then((c) => c.LoginComponent),
    },
    {
        path: 'home',
        loadComponent: () => import('./core/pages/home/home.component').then((c) => c.HomeComponent),
        canActivate: [authGuard],
        children: [
            {
                path: 'todo-list',
                loadComponent: () => import('./todo-list/pages/todo-list/todo-list.component').then((c) => c.TodoListComponent ),
            },
        ],
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home/todo-list',
    },
    {
        path: '**',
        redirectTo: 'home/todo-list',
    },
];