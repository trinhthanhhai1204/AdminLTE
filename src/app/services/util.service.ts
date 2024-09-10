import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  getHour(): number[] {
    let labels = [];
    for (let i = 0; i < 24; i++) {
      labels.push(i);
    }
    return labels;
  }

  getWeek(): string[] {
    let labels = [];
    for (let i = 0; i < 7; i++) {
      let date = new Date(Date.now() - i * (1000 * 60 * 60 * 24));
      let parse = this.parseDate(date);
      labels.unshift(parse);
    }
    return labels;
  }

  getDaysOfMonth(month: number, year: number): string[] {
    let labels: string[] = [];
    let it = new Date(year, month - 1, 1);
    while (it.getMonth() === month - 1) {
      labels.push(this.parseDate(it));
      it = new Date(it.getTime() + 1000 * 60 * 60 * 24);
    }

    return labels;
  }

  getMonthsOfYear() {
    let labels = [];
    for (let i = 0; i < 12; i++) {
      labels.push(i);
    }
    return labels;
  }

  fillYear(min: number, max: number): number[] {
    let years: number[] = [];
    for (let i = min; i <= max; i++) {
      years.push(i);
    }
    return years;
  }

  parseDate(date: any) {
    return `${date.getFullYear()}-${this.padStart((date.getMonth() + 1))}-${this.padStart(date.getDate())}`;
  }

  padStart(number: number): string {
    return number.toString().padStart(2, "0");
  };
}
