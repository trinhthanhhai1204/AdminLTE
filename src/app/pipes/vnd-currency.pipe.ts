import { Pipe, PipeTransform } from '@angular/core';
import {CurrencyPipe} from "@angular/common";

@Pipe({
  name: 'vndCurrency',
  standalone: true
})
export class VNDCurrencyPipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {
  }

  transform(value: string | number): unknown {
    if (value != null) {
      return this.currencyPipe.transform(value, "VND", "");
    }
    return this.currencyPipe.transform(0, "VND", "");
  }

}
