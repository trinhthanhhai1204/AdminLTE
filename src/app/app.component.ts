import {Component, OnInit} from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {NgFor} from '@angular/common';
import {HeaderComponent} from "./components/header/header.component";
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {FooterComponent} from "./components/footer/footer.component";
import swal, {SweetAlertOptions} from 'sweetalert2';
import {ToastService} from "./services/toast.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, RouterModule, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {
  Toast: any = swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000
  });

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toastObservable.subscribe((value: SweetAlertOptions) => {
      if (value !== null) {
        this.Toast.fire(value);
      }
    });
  }
}
