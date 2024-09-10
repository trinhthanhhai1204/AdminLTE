import {Component, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {OrderDetailService} from "../../../services/order-detail.service";
import {VNDCurrencyPipe} from "../../../pipes/vnd-currency.pipe";
import {OrderService} from "../../../services/order.service";
import {switchMap} from "rxjs";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [DatePipe, FormsModule, NgForOf, RouterLink, NgClass, VNDCurrencyPipe],
  templateUrl: './order-details.component.html',
  styles: ``
})
export class OrderDetailsComponent implements OnInit {
  orderDetails: any[] = [];
  orderId!: number;
  count: number = 0;
  order!: any;
  totalPrice: number = 0;
  protected readonly Math = Math;

  constructor(private activatedRoute: ActivatedRoute, private orderDetailService: OrderDetailService, private orderService: OrderService, private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(switchMap(({id}: any) => {
      this.orderId = parseInt(id);
      return this.orderService.getOrderById(this.orderId);
    }), switchMap((order: any) => {
      this.order = order;
      return this.orderDetailService.getOrderDetailsByOrder(this.orderId);
    }), switchMap((orderDetails: any[]) => {
      this.orderDetails = orderDetails;
      this.totalPrice = orderDetails.reduce((previousValue, currentValue) => previousValue + currentValue.price, 0);
      return this.orderDetailService.getOrderDetailsCountByOrder(this.orderId);
    })).subscribe((count: number) => {
      this.count = count;
    });
  }

  onChangeOrderStatus(id: number, status: number) {
    this.orderService.updateOrderStatus(id, status).subscribe(() => {
      this.toastService.makeOrderToast(id, status);
      this.orderService.getOrderById(this.orderId).subscribe((order: any) => {
        this.order = order;
      });
    });
  }
}
