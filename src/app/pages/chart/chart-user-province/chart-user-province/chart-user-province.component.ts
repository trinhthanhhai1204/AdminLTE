import {Component, OnInit} from '@angular/core';
import {ChartService} from "../../../../services/chart.service";
import {Chart, registerables} from "chart.js";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-chart-user-province',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './chart-user-province.component.html',
  styles: ``
})
export class ChartUserProvinceComponent implements OnInit {
  chart: any;
  data: any[] = [];

  constructor(private chartService: ChartService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.chartService.getChartUserProvince().subscribe((data: any[]) => {
      this.chart = new Chart("chart", {
        type: 'bar',
        data: {
          datasets: [{
            label: 'Province',
            data,
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
}
