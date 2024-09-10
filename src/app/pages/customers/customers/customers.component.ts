import {Component, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {CustomerService} from "../../../services/customer.service";
import {VNDCurrencyPipe} from "../../../pipes/vnd-currency.pipe";

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [NgForOf, ReactiveFormsModule, RouterLink, FormsModule, NgClass, DatePipe, VNDCurrencyPipe],
  templateUrl: './customers.component.html',
  styles: []
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  sort: string = "0";
  page: number = 0;
  pages: number = 0;
  count: number = 0;
  pagesSequence: number[] = [];
  size: number = 10;
  deleteRequestId: number = 0;
  protected readonly Math = Math;

  constructor(private customerService: CustomerService) {
  }

  ngOnInit(): void {
    this.customerService.getCustomersCount(2).subscribe((count: number) => {
      this.count = count;
      this.pages = Math.ceil(count / this.size);
      let sequence: number[] = [];
      for (let i = 0; i < this.pages; i++) {
        sequence.push(i + 1);
      }
      this.pagesSequence = sequence;
      this.getCustomers();
    });
  }

  onSortChange() {
    this.setPage(0);
  }

  getCustomers() {
    let sort = parseInt(this.sort);
    this.customerService.getCustomers(2, this.page, this.size, sort).subscribe((customers: any[]) => {
      this.customers = customers;
    });
  }

  setPage(i: number) {
    this.page = i;
    this.getCustomers();
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

  onDeleteCustomerRequest(id: number) {
    this.deleteRequestId = id;
  }

  onDeleteCustomer() {
    this.customerService.deleteCustomer(this.deleteRequestId).subscribe(() => {
      this.setPage(this.page);
    });
  }
}
