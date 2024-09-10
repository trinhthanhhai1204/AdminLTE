import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {VNDCurrencyPipe} from "../../../pipes/vnd-currency.pipe";
import {StatisticalService} from "../../../services/statistical.service";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-revenue-by-district',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    VNDCurrencyPipe
  ],
  templateUrl: './revenue-by-district.component.html',
  styles: ``
})
export class RevenueByDistrictComponent implements OnInit {
  provinceId!: number;
  data: any[] = [];
  sum: number = 0;

  constructor(private statisticalService: StatisticalService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap(({id}) => {
        this.provinceId = parseInt(id);
        return this.statisticalService.getDataByDistrict(this.provinceId);
      })
    ).subscribe((data: any[]) => {
      this.data = data;
      this.sum = this.data.reduce((previousValue, currentValue) => previousValue + currentValue.revenue, 0);
    })
  }
}
