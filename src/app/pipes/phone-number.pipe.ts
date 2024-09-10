import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber',
  standalone: true
})
export class PhoneNumberPipe implements PipeTransform {
  transform(value: string): string {
    let strings = value.split("");
    let blocks = [];
    for (let i = 0; i < 3; i++) {
      let block = i == 0 ? strings.slice(0, 4) : strings.slice(i * 3 + 1, i * 3 + 4);
      blocks.push(block.join(""));
    }
    return blocks.join(" ");
  }

}
