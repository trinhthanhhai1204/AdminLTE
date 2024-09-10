import {Component, OnInit} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {NgClass, NgForOf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {CustomerService} from "../../../services/customer.service";
import {map, of, switchMap} from "rxjs";
import {FileService} from "../../../services/file.service";
import {AddressService} from "../../../services/address.service";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [FormsModule, NgForOf, RouterLink, NgClass],
  templateUrl: './add-customer.component.html',
  styles: ``
})
export class AddCustomerComponent implements OnInit {
  image: string = "/assets/img/image-placeholder.jpg";
  fullName: string = "";
  phone: string = "0312456789";
  username: string = "user" + Math.random().toString().substring(2);
  password: string = "123456";
  confirmPassword: string = "123456";
  gender: string = "male";
  birthday: string = "";

  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];

  province: string = "";
  district: string = "";
  ward: string = "";
  wasValidated: boolean = false;

  constructor(private customerService: CustomerService, private fileService: FileService, private router: Router, private addressService: AddressService, private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.addressService.getProvinces().subscribe((provinces: any[]) => {
      this.provinces = provinces;
    })
  }

  onChangeImage($event: Event) {
    let target = $event.target as HTMLInputElement;
    if (target.files) {
      let files = target.files;
      if (files.length != 0) {
        let file = files[0];

        let reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target) {
            this.image = e.target.result as string;
          }
        }

        reader.readAsDataURL(file);
      }
    }
  }

  onAddCustomer(form: NgForm) {
    this.wasValidated = true;

    if (form.valid) {
      if (this.confirmPassword === this.password) {
        of(this.image).pipe(switchMap((image: string) => {
          return image !== "/assets/img/image-placeholder.jpg" ? this.fileService.upload(this.image).pipe(map((image: any) => image.url)) : of("/images/image-placeholder.jpg");
        })).subscribe((image: string) => {
          let customer = {
            name: this.fullName,
            gender: this.gender,
            image,
            phone: this.phone,
            username: this.username,
            password: this.password,
            role: 2,
            birthday: this.birthday,
            ward: this.ward !== "" ? parseInt(this.ward) : null
          }
          this.customerService.saveCustomer(customer).subscribe(() => {
            this.router.navigate([`/user/customers`]);
          });
        });
      }
      else {
        this.toastService.makeWarningToast("Mật khẩu và xác nhận mật khẩu chưa trùng nhau!");
      }
    }
    else {
      this.toastService.makeErrorToast("Các trường chưa được nhập hợp lệ!");
    }
  }

  onProvinceChange($event: Event) {
    let target = $event.target as HTMLSelectElement;
    let value = target.value;
    if (value !== "") {
      this.addressService.getDistricts(value).subscribe((districts: any) => {
        this.districts = districts;
      });
    } else {
      this.districts = [];
    }
    this.district = "";
    this.ward = "";
  }

  onDistrictChange($event: Event) {
    let target = $event.target as HTMLSelectElement;
    let value = target.value;
    if (value !== "") {
      this.addressService.getWards(value).subscribe((wards: any[]) => {
        this.wards = wards;
      });
    } else {
      this.wards = [];
    }
    this.ward = "";
  }
}
