import {Component, Input, OnInit} from '@angular/core';
import {VNDCurrencyPipe} from "../../../../pipes/vnd-currency.pipe";
import {OrderDetailService} from "../../../../services/order-detail.service";
import {OrderService} from "../../../../services/order.service";

@Component({
  selector: 'app-customer-details-profile',
  standalone: true,
  imports: [
    VNDCurrencyPipe
  ],
  templateUrl: './customer-details-profile.component.html',
  styles: ''
})
export class CustomerDetailsProfileComponent implements OnInit {
  @Input() customer!: any;
  @Input() count!: number;
  countSuccess!: number;
  revenues!: number;
  statusSuccess: string = "4";

  constructor(private orderService: OrderService, private orderDetailService: OrderDetailService) { }

  ngOnInit(): void {
    this.orderDetailService.getRevenuesOfCustomerById(this.customer.id).subscribe((revenues: number) => {
      this.revenues = revenues;
    });
    this.orderService.getCountByCustomerId(this.customer.id, this.statusSuccess).subscribe((count: number) => {
      this.countSuccess = count;
    });
  }

}
