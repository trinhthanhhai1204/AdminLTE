import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {VNDCurrencyPipe} from "../../../pipes/vnd-currency.pipe";
import {StatisticalService} from "../../../services/statistical.service";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-revenue-by-year',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    RouterLink,
    VNDCurrencyPipe
  ],
  templateUrl: './revenue-by-year.component.html',
  styles: ``
})
export class RevenueByYearComponent implements OnInit {
  currentYear!: number;
  year!: number;
  data: any[] = [];
  sum: number = 0;

  constructor(private statisticalService: StatisticalService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    let date = new Date();
    this.currentYear = date.getFullYear();
    this.activatedRoute.queryParams.pipe(
      switchMap(({year}) => {
        let number = parseInt(year);
        this.year = !isNaN(number) && number <= this.currentYear ? number : this.currentYear;
        return this.statisticalService.getDataByYear(this.year);
      })
    ).subscribe((data: any[]) => {
      this.data = data;
      this.sum = data.reduce((previousValue, currentValue) => previousValue + currentValue.revenue, 0);
    });
  }

  onUpdateChart() {
    if (!this.year || this.year > this.currentYear) {
      this.year = this.currentYear;
    }
    this.statisticalService.getDataByYear(this.year).subscribe((data: any[]) => {
      this.data = data;
      this.sum = data.reduce((previousValue, currentValue) => previousValue + currentValue.revenue, 0);
    });
  }
}
