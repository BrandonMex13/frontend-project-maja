import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from "../components/side-menu/side-menu.component";

@Component({
  selector: 'app-home-component',
  imports: [RouterOutlet, SideMenuComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
