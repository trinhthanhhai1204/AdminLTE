import { Component } from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {HeaderComponent} from "../header/header.component";
import {RouterOutlet} from "@angular/router";
import {SidebarComponent} from "../sidebar/sidebar.component";

@Component({
  selector: 'app-main',
  standalone: true,
    imports: [
        FooterComponent,
        HeaderComponent,
        RouterOutlet,
        SidebarComponent
    ],
  templateUrl: './main.component.html',
  styles: ``
})
export class MainComponent {

}
