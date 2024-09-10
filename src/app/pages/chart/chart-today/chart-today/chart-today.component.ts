import {Component, OnInit} from '@angular/core';
import {Chart, registerables} from "chart.js";
import {enUS} from "date-fns/locale";
import "chartjs-adapter-date-fns";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ChartService} from "../../../../services/chart.service";

@Component({
  selector: 'app-chart-today',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './chart-today.component.html',
  styles: []
})
export class ChartTodayComponent implements OnInit {
  date: string = "";
  chart: any;
  data: any[] = [];

  constructor(private activatedRoute: ActivatedRoute, private chartService: ChartService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(({date}) => {
      if (date) {
        this.date = date;
      }
      else {
        let date = new Date();
        this.date = `${date.getFullYear()}-${this.padStart((date.getMonth() + 1))}-${this.padStart(date.getDate())}`;
      }
    });

    this.chartService.getDataByDate(this.date).subscribe((data: any[]) => {
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
                  hour: "HH:mm"
                },
                unit: "hour"
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
    this.chartService.getDataByDate(this.date).subscribe((data: any[]) => {
      this.data = data;
      this.chart.data.datasets = this.chart.data.datasets.map((d: any) => {
        d.data = data;
        return d;
      });
      this.chart.update();
    });
  }

  private padStart(number: number): string {
    return number.toString().padStart(2, "0");
  };
}
