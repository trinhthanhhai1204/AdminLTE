import {Component, Input} from '@angular/core';
import {PhoneNumberPipe} from "../../../../pipes/phone-number.pipe";

@Component({
  selector: 'app-customer-details-details',
  standalone: true,
  imports: [
    PhoneNumberPipe
  ],
  templateUrl: './customer-details-details.component.html',
  styles: ``
})
export class CustomerDetailsDetailsComponent {
  @Input() customer!: any;
  @Input() addressRender!: string;
}
