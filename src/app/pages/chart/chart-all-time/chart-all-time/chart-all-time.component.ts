import { Component } from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {Chart, registerables} from "chart.js";
import {enUS} from "date-fns/locale";
import {ChartService} from "../../../../services/chart.service";

@Component({
  selector: 'app-chart-all-time',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './chart-all-time.component.html',
  styles: ``
})
export class ChartAllTimeComponent {
  chart: any;
  data: any[] = [];

  constructor(private chartService: ChartService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.chartService.getDataAllTime().subscribe((data: any[]) => {
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
            x: {
              type: "time",
              adapters: {
                date: {
                  locale: enUS
                }
              },
              time: {
                unit: "year"
              }
            },
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
  }
}
