import {Component, Input, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {OrderService} from "../../../../services/order.service";

@Component({
  selector: 'app-customer-details-timeline',
  standalone: true,
  imports: [DatePipe, RouterLink, NgForOf, NgClass],
  templateUrl: './customer-details-timeline.component.html',
  styles: ``
})
export class CustomerDetailsTimelineComponent implements OnInit {
  @Input() customer!: any;
  @Input() status!: string;
  @Input() count!: number;
  now!: number;
  details: any[] = [];
  page: number = 0;
  pages: number = 0;
  pagesSequence: number[] = [];
  size: number = 10;
  sort: number = 2;
  protected readonly Math = Math;

  constructor(private orderService: OrderService) {
  }

  ngOnInit(): void {
    this.now = Date.now();
    this.pages = Math.ceil(this.count / this.size);
    let sequence: number[] = [];
    for (let i = 0; i < this.pages; i++) {
      sequence.push(i + 1);
    }
    this.pagesSequence = sequence;
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrdersByCustomerId(this.customer.id, this.status, this.page, this.size, this.sort).subscribe((orders: any[]) => {
      this.details = orders;
    });
  }

  setPage(i: number) {
    this.page = i;
    this.getOrders();
  }

  onPrevClick() {
    if (this.page != 0) {
      this.setPage(this.page - 1);
    }
  }

  onNextClick() {
    if (this.page != this.pages - 1) {
      this.setPage(this.page + 1);
    }
  }
}
