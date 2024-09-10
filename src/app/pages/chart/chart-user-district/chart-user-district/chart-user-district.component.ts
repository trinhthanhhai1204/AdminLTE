import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {ChartService} from "../../../../services/chart.service";
import {Chart, registerables} from "chart.js";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {AddressService} from "../../../../services/address.service";

@Component({
  selector: 'app-chart-user-district',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgForOf,
    FormsModule
  ],
  templateUrl: './chart-user-district.component.html',
  styles: ``
})
export class ChartUserDistrictComponent implements OnInit {
  chart: any;
  data: any[] = [];
  provinces: any[] = [];
  province: string = "";

  constructor(private chartService: ChartService, private addressService: AddressService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.addressService.getProvinces().subscribe((provinces: any[]) => {
      this.provinces = provinces;
      this.chart = new Chart("chart", {
        type: 'bar',
        data: {
          datasets: [{
            label: 'District',
            data: this.data,
            backgroundColor: ['rgba(255, 159, 64, 0.2)'],
            borderColor: ['rgb(255, 159, 64)'],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
      });
    });
  }

  onProvinceChange() {
    if (this.province === "") {
      this.data = [];
      this.chart.data.datasets = this.chart.data.datasets.map((d: any) => {
        d.data = [];
        return d;
      });
      this.chart.update();
    }
    else {
      let provinceId = parseInt(this.province);
      this.chartService.getChartUserDistrict(provinceId).subscribe((data: any[]) => {
        this.data = data;
        this.chart.data.datasets = this.chart.data.datasets.map((d: any) => {
          d.data = data;
          return d;
        });
        this.chart.update();
      });
    }
  }
}
