import {Component, Input, OnInit} from '@angular/core';
import {DatePipe} from "@angular/common";
import {PhoneNumberPipe} from "../../../../pipes/phone-number.pipe";
import {RouterLink} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-customer-details-full-details',
  standalone: true,
  imports: [
    DatePipe,
    PhoneNumberPipe,
    RouterLink
  ],
  templateUrl: './customer-details-full-details.component.html',
  styles: ``
})
export class CustomerDetailsFullDetailsComponent implements OnInit {
  @Input() customer!: any;
  @Input() addressRender!: string;
  canUpdateUser: boolean = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    let auth = this.authService.getAuth();
    let currentId = auth.id;
    let currentRole = this.authService.getRole();

    let {role: customerRole, id: customerId} = this.customer;

    this.canUpdateUser = customerRole === "USER" ||
      currentRole === "OWNER" && customerRole === "STAFF" ||
      currentId === customerId;
  }

}
