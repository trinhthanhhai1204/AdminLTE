import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {ChartService} from "../../../../services/chart.service";
import {AddressService} from "../../../../services/address.service";
import {Chart, registerables} from "chart.js";

@Component({
  selector: 'app-chart-user-ward',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './chart-user-ward.component.html',
  styles: ``
})
export class ChartUserWardComponent {
  chart: any;
  data: any[] = [];
  provinces: any[] = [];
  province: string = "";
  districts: any[] = [];
  district: string = "";

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
            label: 'Ward',
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
      this.district = "";
      this.districts = [];
    }
    else {
      this.addressService.getDistricts(this.province).subscribe((data: any[]) => {
        this.districts = data;
      });
    }
  }

  onUpdateChart() {
    if (this.district === "") {
      this.data = [];
      this.chart.data.datasets = this.chart.data.datasets.map((d: any) => {
        d.data = [];
        return d;
      });
      this.chart.update();
    }
    else {
      let districtId = parseInt(this.district);
      this.chartService.getChartUserWard(districtId).subscribe((data: any[]) => {
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
