import {Component, OnInit} from '@angular/core';
import {BookDetailsOptionsComponent} from "../../../books/book-details-options/book-details-options.component";
import {DatePipe, DecimalPipe, NgClass, NgForOf} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {VNDCurrencyPipe} from "../../../../pipes/vnd-currency.pipe";
import {CustomerService} from "../../../../services/customer.service";
import {switchMap} from "rxjs";
import {OrderService} from "../../../../services/order.service";
import {PhoneNumberPipe} from "../../../../pipes/phone-number.pipe";
import {CustomerDetailsProfileComponent} from "../customer-details-profile/customer-details-profile.component";
import {CustomerDetailsDetailsComponent} from "../customer-details-details/customer-details-details.component";
import {
  CustomerDetailsFullDetailsComponent
} from "../customer-details-full-details/customer-details-full-details.component";
import {CustomerDetailsTimelineComponent} from "../customer-details-timeline/customer-details-timeline.component";

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [BookDetailsOptionsComponent, NgForOf, RouterLink, VNDCurrencyPipe, DatePipe, NgClass, DecimalPipe, PhoneNumberPipe, CustomerDetailsProfileComponent, CustomerDetailsDetailsComponent, CustomerDetailsFullDetailsComponent, CustomerDetailsTimelineComponent],
  templateUrl: './customer-details.component.html',
  styles: ``
})
export class CustomerDetailsComponent implements OnInit {
  customerId!: number;
  customer!: any;
  addressRender!: string;
  count: number = 0;
  status: string = "";

  constructor(private customerService: CustomerService, private orderService: OrderService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap(({id}) => {
        this.customerId = id;
        return this.customerService.getCustomerById(this.customerId);
      }), switchMap((customer: any) => {
        this.customer = customer;
        if (customer.ward) {
          this.addressRender = `${customer.ward.fullName} - ${customer.ward.district.fullName} - ${customer.ward.district.province.fullName}`;
        }
        return this.orderService.getCountByCustomerId(this.customerId, this.status);
      })
    ).subscribe((count: number) => {
      this.count = count;
    });
  }
}
