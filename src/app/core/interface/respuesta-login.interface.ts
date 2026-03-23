import { MenuOptionInterface } from "./menu-option.interface";
import { UsuarioSesionInterface } from "./usuario-sesion.interface";

export interface RespuestaLoginInterface {
    access_token: string;
    user: UsuarioSesionInterface;
    menus: MenuOptionInterface[];
}
