import {Component, OnInit} from '@angular/core';
import {Chart, registerables} from "chart.js";
import {enUS} from "date-fns/locale";
import "chartjs-adapter-date-fns";
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ChartService} from "../../../../services/chart.service";

@Component({
  selector: 'app-chart-week',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './chart-week.component.html',
  styles: []
})
export class ChartWeekComponent implements OnInit{
  chart: any;
  data: any[] = [];

  constructor(private chartService: ChartService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.chartService.getDataByWeek().subscribe((data: any[]) => {
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
                displayFormats: {
                  day: "dd-MMM-yy"
                },
                unit: "day"
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
