import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {VNDCurrencyPipe} from "../../../pipes/vnd-currency.pipe";
import {StatisticalService} from "../../../services/statistical.service";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-revenue-by-month',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    NgForOf,
    RouterLink,
    VNDCurrencyPipe
  ],
  templateUrl: './revenue-by-month.component.html',
  styles: ``
})
export class RevenueByMonthComponent implements OnInit {
  month!: number;
  year!: number;
  maxMonth!: number;
  currentYear!: number;
  data: any[] = [];
  sum: number = 0;

  constructor(private statisticalService: StatisticalService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    let date = new Date();

    let currentYear = date.getFullYear();
    let currentMonth = date.getMonth() + 1;

    this.currentYear = currentYear;
    this.maxMonth = currentMonth;

    this.activatedRoute.queryParams.pipe(
      switchMap(({month, year}) => {
        const inputYear = parseInt(year);
        const inputMonth = parseInt(month);
        const isYearValid = !isNaN(inputYear) && inputYear <= currentYear;
        const isMonthValid = !isNaN(inputMonth) && inputMonth >= 1 && inputMonth <= 12;

        if (isYearValid && isMonthValid) {
          this.year = inputYear;
          this.maxMonth = (inputYear === currentYear) ? currentMonth : 12;
          this.month = (inputMonth <= this.maxMonth) ? inputMonth : this.maxMonth;
        } else {
          this.year = currentYear;
          this.month = currentMonth;
        }

        return this.statisticalService.getDataByMonth(this.month, this.year);
      })
    ).subscribe((data: any[]) => {
      this.data = data;
      this.sum = data.reduce((previousValue, currentValue) => previousValue + currentValue.revenue, 0);
    });
  }

  onUpdateChart() {
    this.statisticalService.getDataByMonth(this.month, this.year).subscribe((data: any[]) => {
      this.data = data;
      this.sum = data.reduce((previousValue, currentValue) => previousValue + currentValue.revenue, 0);
    });
  }

  onMonthChange($event: Event) {
    let target = $event.target as HTMLInputElement;
    let value = parseInt(target.value);

    if (target.value === "" || value < 1) {
      this.month = 1;
    } else if (value > this.maxMonth) {
      this.month = this.maxMonth;
    }
  }

  onYearChange($event: Event) {
    let target = $event.target as HTMLInputElement;
    let value = parseInt(target.value);

    if (target.value === "" || value > this.currentYear) {
      this.year = this.currentYear;
    } else if (value < 2019) {
      this.year = 2019;
    }

    if (this.year === this.currentYear) {
      let currentDate = new Date();
      this.maxMonth = currentDate.getMonth() + 1;
    } else {
      this.maxMonth = 12;
    }
    
    if (this.month > this.maxMonth) {
      this.month = this.maxMonth;
    }
  }
}
