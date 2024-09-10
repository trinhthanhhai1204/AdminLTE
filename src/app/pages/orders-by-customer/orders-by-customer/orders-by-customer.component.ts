import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {OrderService} from "../../../services/order.service";
import {DatePipe, NgClass, NgForOf} from "@angular/common";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-orders-by-customer',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, NgForOf, NgClass],
  templateUrl: './orders-by-customer.component.html',
  styles: []
})
export class OrdersByCustomerComponent implements OnInit {
  customerId!: number;
  orders: any[] = [];
  status: string = "";
  sort: string = "0";
  page: number = 0;
  pages: number = 0;
  count: number = 0;
  size: number = 10;
  orderStatusList: any[] = [];
  pagesSequence: number[] = [];
  protected readonly Math = Math;

  constructor(private activatedRoute: ActivatedRoute, private orderService: OrderService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.getOrderStatus();
    this.getCustomerId();
    this.getPages();
    this.getOrders();
  }

  getCustomerId() {
    this.activatedRoute.params.subscribe(({id}) => {
      this.customerId = parseInt(id);
    });
  }

  getOrders() {
    let sort = parseInt(this.sort);
    this.orderService.getOrdersByCustomerId(this.customerId, this.status, this.page, this.size, sort).subscribe((orders: any[]) => {
      this.orders = orders;
    });
  }

  getOrderStatus() {
    this.orderService.getOrderStatusList().subscribe((o: any[]) => {
      this.orderStatusList = o;
    });
  }

  getPages() {
    this.orderService.getCountByCustomerId(this.customerId, this.status).subscribe((count: number) => {
      this.count = count;
      this.pages = Math.ceil(count / this.size);
      let sequence: number[] = [];
      for (let i = 0; i < this.pages; i++) {
        sequence.push(i + 1);
      }
      this.pagesSequence = sequence;
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
