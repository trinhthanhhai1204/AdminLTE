import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Chart, registerables} from "chart.js";
import {enUS} from "date-fns/locale";
import {ChartService} from "../../../../services/chart.service";

@Component({
  selector: 'app-chart-year',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './chart-year.component.html',
  styles: ``
})
export class ChartYearComponent implements OnInit {
  year!: number;
  chart: any;
  data: any[] = [];

  constructor(private activatedRoute: ActivatedRoute, private chartService: ChartService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(({year}) => {
      this.year = year ? parseInt(year):new Date().getFullYear();
    });

    this.chartService.getDataByYear(this.year).subscribe((data: any[]) => {
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
                unit: "month"
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

  onUpdateChart() {
    this.chartService.getDataByYear(this.year).subscribe((data: any[]) => {
      this.data = data;
      this.chart.data.datasets = this.chart.data.datasets.map((d: any) => {
        d.data = data;
        return d;
      });
      this.chart.update();
    });
  }
}
