import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {VNDCurrencyPipe} from "../../../pipes/vnd-currency.pipe";
import {StatisticalService} from "../../../services/statistical.service";

@Component({
  selector: 'app-revenue-all-time',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    RouterLink,
    VNDCurrencyPipe
  ],
  templateUrl: './revenue-all-time.component.html',
  styles: ``
})
export class RevenueAllTimeComponent implements OnInit {
  data: any[] = [];
  sum: number = 0;

  constructor(private statisticalService: StatisticalService) {
  }

  ngOnInit(): void {
    this.statisticalService.getDataAllTime().subscribe((data: any[]) => {
      this.data = data;
      this.sum = data.reduce((previousValue, currentValue) => previousValue + currentValue.revenue, 0);
    });
  }
}
