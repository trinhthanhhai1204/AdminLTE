import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {CustomerService} from "../../services/customer.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass
  ],
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent implements OnInit {
  id!: number;
  image!: string;
  name!: string;
  role!: string;
  constructor(private authService: AuthService, private router: Router, private customerService: CustomerService) {}

  ngOnInit(): void {
    let auth = this.authService.getAuth();
    this.customerService.getCustomerSidebar(auth.id).subscribe((customer: any) => {
      this.id = customer.id;
      this.name = customer.name
      this.image = customer.image;
      this.role = customer.role;
    });
  }

  logout() {
    this.authService.handleLogout();
    this.router.navigate(['/login']);
  }
}
