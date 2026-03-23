import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuOptionInterface } from '../../../../interface/menu-option.interface';

@Component({
    selector: 'app-side-menu-options-component',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './side-menu-options.component.html',
})
export class SideMenuOptionsComponent {

    menuOptions: MenuOptionInterface[] = [
        {
            icon: 'fa-solid fa-magnifying-glass',
            label: 'To Do List',
            sublabel: 'Lista de pendientes',
            route: '/home/todo-list',
        }
    ]
}
