import {Component, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {OrderService} from "../../../services/order.service";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [DatePipe, NgForOf, ReactiveFormsModule, RouterLink, NgClass, FormsModule],
  templateUrl: './orders.component.html',
  styles: []
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  status: string = "";
  sort: string = "0";
  page: number = 0;
  pages: number = 0;
  count: number = 0;
  pagesSequence: number[] = [];
  size: number = 10;
  orderStatusList: any[] = [];
  protected readonly Math = Math;

  constructor(private orderService: OrderService, private activatedRoute: ActivatedRoute, private toastService: ToastService) {}

  ngOnInit(): void {
    this.getOrderStatus();
    this.activatedRoute.queryParams.subscribe(({status}) => {
      if (status) {
        this.status = status;
      }
    });
    this.getPages();
    this.getOrders();
  }

  getOrders() {
    let sort = parseInt(this.sort);
    this.orderService.getOrders(this.status, this.page, this.size, sort).subscribe((orders: any[]) => {
      this.orders = orders;
    });
  }

  getPages() {
    this.orderService.getCount(this.status).subscribe((count: number) => {
      this.count = count;
      this.pages = Math.ceil(count / this.size);
      let sequence: number[] = [];
      for (let i = 0; i < this.pages; i++) {
        sequence.push(i + 1);
      }
      this.pagesSequence = sequence;
    });
  }

  getOrderStatus() {
    this.orderService.getOrderStatusList().subscribe((o: any[]) => {
      this.orderStatusList = o;
    });
  }

  onStatusChange() {
    this.sort = "0";
    this.getPages();
    this.setPage(0);
  }

  onSortChange() {
    this.setPage(0);
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

  onChangeOrderStatus(id: number, status: number) {
    this.orderService.updateOrderStatus(id, status).subscribe(() => {
      this.getPages();
      this.setPage(this.page);
      this.toastService.makeOrderToast(id, status);
    });
  }
}
