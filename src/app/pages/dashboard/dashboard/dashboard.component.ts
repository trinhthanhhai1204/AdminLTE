import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {OrderService} from "../../../services/order.service";
import {StatisticalService} from "../../../services/statistical.service";
import {VNDCurrencyPipe} from "../../../pipes/vnd-currency.pipe";
import {DatePipe, NgForOf} from "@angular/common";
import {ChartService} from "../../../services/chart.service";
import {Chart, registerables} from "chart.js";
import {enUS} from "date-fns/locale";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    VNDCurrencyPipe,
    NgForOf,
    DatePipe
  ],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit {
  order: number = 0;
  revenue: number = 0;
  countOutOfStock: number = 0;
  customer: number = 0;
  orders: any[] = [];
  month!: number;
  chart: any;
  data: any[] = [];
  outOfStock: any[] = [];

  constructor(private orderService: OrderService, private statisticalService: StatisticalService, private chartService: ChartService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    let date = new Date();
    this.month = date.getMonth() + 1;
    let year = date.getFullYear();
    this.orderService.getCount("1").subscribe((count: number) => {
      this.order = count;
    });
    this.statisticalService.getDataByMonth(this.month, year).subscribe((data: any[]) => {
      this.revenue = data.reduce((previousValue, currentValue) => previousValue + currentValue.revenue, 0);
    });
    this.statisticalService.getDataAllTime().subscribe((data: any[]) => {
      this.countOutOfStock = data.reduce((previousValue, currentValue) => previousValue + currentValue.revenue, 0);
    });
    this.statisticalService.getCountValuableCustomer().subscribe((count: number) => {
      this.customer = count;
    });
    this.orderService.getOrders("1", 0, 5, 1).subscribe((orders: any[]) => {
      this.orders = orders;
    });
    this.chartService.getDataByWeek().subscribe((data: any[]) => {
      this.data = data;
      this.chart = new Chart("chart-by-week", {
        data: {
          datasets: [
            {
              type: 'bar',
              label: "Doanh thu (đồng)",
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
    this.statisticalService.getCountOutOfStock().subscribe((count: number) => {
      this.countOutOfStock = count;
    });
    this.statisticalService.getOutOfStock(0, 5).subscribe((outOfStock: any[]) => {
      this.outOfStock = outOfStock;
    });
    this.chartService.getChartRevenueByCategory().subscribe((data: any[]) => {
      this.data = data;
      this.chart = new Chart("chart-by-category", {
        data: {
          datasets: [
            {
              type: 'bar',
              label: "Doanh thu (đồng)",
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
