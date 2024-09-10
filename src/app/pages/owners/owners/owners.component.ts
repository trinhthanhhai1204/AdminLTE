import { Component } from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {CustomerService} from "../../../services/customer.service";

@Component({
  selector: 'app-owners',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    RouterLink,
    NgClass,
    FormsModule
  ],
  templateUrl: './owners.component.html',
  styles: ``
})
export class OwnersComponent {
  customers: any[] = [];
  sort: string = "0";
  page: number = 0;
  pages: number = 0;
  count: number = 0;
  pagesSequence: number[] = [];
  size: number = 10;
  protected readonly Math = Math;

  constructor(private customerService: CustomerService) {
  }

  ngOnInit(): void {
    this.customerService.getCustomersCount(0).subscribe((count: number) => {
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
    this.customerService.getCustomers(0, this.page, this.size, sort).subscribe((customers: any[]) => {
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
}
