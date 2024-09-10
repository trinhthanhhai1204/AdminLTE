import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {StatisticalService} from "../../../services/statistical.service";
import {VNDCurrencyPipe} from "../../../pipes/vnd-currency.pipe";
import {FormsModule} from "@angular/forms";
import {switchMap} from "rxjs";
import {UtilService} from "../../../services/util.service";

@Component({
  selector: 'app-revenue-by-date',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    VNDCurrencyPipe,
    DatePipe,
    FormsModule
  ],
  templateUrl: './revenue-by-date.component.html',
  styles: ``
})
export class RevenueByDateComponent implements OnInit {
  date: string = "";
  currentDate!: string;
  data: any[] = [];
  sum: number = 0;

  constructor(private statisticalService: StatisticalService, private activatedRoute: ActivatedRoute, private utilService: UtilService) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(
      switchMap(({date}) => {
        let d = new Date();
        this.currentDate = this.utilService.parseDate(d);
        this.date = date && new Date(date).getTime() < d.getTime() ? date : this.currentDate;
        return this.statisticalService.getDataByDate(this.date);
      })
    ).subscribe((data: any[]) => {
      this.data = data;
      this.sum = data.reduce((previousValue, currentValue) => previousValue + currentValue.sum, 0);
    });
  }

  onDateChange() {
    if (new Date(this.date).getTime() > new Date(this.currentDate).getTime()) {
      this.date = this.currentDate;
    }
    this.statisticalService.getDataByDate(this.date).subscribe((data: any[]) => {
      this.data = data;
      this.sum = data.reduce((previousValue, currentValue) => previousValue + currentValue.sum, 0);
    });
  }
}
