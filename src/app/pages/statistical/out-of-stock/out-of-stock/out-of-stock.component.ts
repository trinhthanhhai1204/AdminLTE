import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {VNDCurrencyPipe} from "../../../../pipes/vnd-currency.pipe";
import {StatisticalService} from "../../../../services/statistical.service";

@Component({
  selector: 'app-out-of-stock',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    RouterLink,
    VNDCurrencyPipe,
    NgClass
  ],
  templateUrl: './out-of-stock.component.html',
  styles: ``
})
export class OutOfStockComponent implements OnInit {
  books: any[] = [];
  page: number = 0;
  size: number = 10;

  protected readonly Math = Math;

  constructor(private statisticalService: StatisticalService) {
  }

  ngOnInit(): void {
    this.getOutOfStock();
  }

  setPage(i: number) {
    this.page = i;
    this.getOutOfStock();
  }

  onPrevClick() {
    if (this.page != 0) {
      this.setPage(this.page - 1);
    }
  }

  onNextClick() {
    if (this.books.length > 0) {
      this.setPage(this.page + 1);
    }
  }

  getOutOfStock() {
    this.statisticalService.getOutOfStock(this.page, this.size).subscribe((outOfStock: any[]) => {
      this.books = outOfStock;
    });
  }
}
