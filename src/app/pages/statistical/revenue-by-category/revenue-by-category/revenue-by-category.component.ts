import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {VNDCurrencyPipe} from "../../../../pipes/vnd-currency.pipe";
import {ChartService} from "../../../../services/chart.service";
import {Chart, registerables} from "chart.js";
import {enUS} from "date-fns/locale";

@Component({
  selector: 'app-revenue-by-category',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    VNDCurrencyPipe
  ],
  templateUrl: './revenue-by-category.component.html',
  styles: ``
})
export class RevenueByCategoryComponent implements OnInit {
  chart: any;
  data: any[] = [];

  constructor(private chartService: ChartService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.chartService.getChartRevenueByCategory().subscribe((data: any[]) => {
      this.data = data;
      this.chart = new Chart("chart", {
        data: {
          datasets: [
            {
              type: 'bar',
              label: "Revenue (Bar)",
              data: this.data,
              backgroundColor: "rgba(253,126,20,0.25)",
              borderColor: "#fd7e14",
              borderWidth: 1
            }
          ]
        },
        options : {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
  }
}
