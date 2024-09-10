import { Component } from '@angular/core';
import {StatisticalService} from "../../../services/statistical.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {switchMap} from "rxjs";
import {NgForOf} from "@angular/common";
import {VNDCurrencyPipe} from "../../../pipes/vnd-currency.pipe";

@Component({
  selector: 'app-revenue-by-ward',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    VNDCurrencyPipe
  ],
  templateUrl: './revenue-by-ward.component.html',
  styles: ``
})
export class RevenueByWardComponent {
  districtId!: number;
  data: any[] = [];
  sum: number = 0;

  constructor(private statisticalService: StatisticalService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap(({id}) => {
        this.districtId = parseInt(id);
        return this.statisticalService.getDataByWard(this.districtId);
      })
    ).subscribe((data: any[]) => {
      console.log(data);
      this.data = data;
      this.sum = this.data.reduce((previousValue, currentValue) => previousValue + currentValue.revenue, 0);
    })
  }
}
