import { afterNextRender, Component } from '@angular/core';

@Component({
    selector: 'app-side-menu-header-component',
    imports: [],
    templateUrl: './side-menu-header.component.html',
})
export class SideMenuHeaderComponent {

    usuario: string | null = "";

    constructor() {
        afterNextRender(() => {

            const storedData = localStorage.getItem("usuario");
            if(storedData){
                try{
                    this.usuario = storedData;
                }
                catch(error){
                    console.error(error)
                }
            }
        });
    }

    // obtenerUsuario(): string | null {
    //     return this.usuario = localStorage.getItem("usuario");
    // }

}
