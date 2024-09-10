import {Component, OnInit} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {map, of, switchMap} from "rxjs";
import {CustomerService} from "../../../services/customer.service";
import {HttpResponse} from "@angular/common/http";
import {FileService} from "../../../services/file.service";
import {NgForOf} from "@angular/common";
import {AddressService} from "../../../services/address.service";

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [FormsModule, RouterLink, NgForOf],
  templateUrl: './update-user.component.html',
  styles: ``
})
export class UpdateUserComponent implements OnInit {
  id!: number;
  image!: string;
  fullName!: string;
  phone!: string;
  username!: string;
  gender!: string;
  role!: string;
  isUploaded: boolean = true;
  birthday!: string;
  roles: any[] = [];
  customer!: any;

  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];

  province: string = "";
  district: string = "";
  ward: string = "";

  constructor(private activatedRoute: ActivatedRoute, private customerService: CustomerService, private fileService: FileService, private router: Router, private addressService: AddressService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(switchMap(({id}) => {
      this.id = parseInt(id);
      return this.customerService.getRoles();
    }), switchMap((roles: any[]) => {
      this.roles = roles;
      return this.customerService.getCustomerById(this.id);
    }), switchMap((customer: any) => {
      this.customer = customer;
      this.image = customer.image;
      this.fullName = customer.name;
      this.phone = customer.phone;
      this.username = customer.username;
      this.gender = customer.gender;
      this.birthday = customer.birthday;
      this.role = this.roles.find((role: any) => role.name === customer.role).index.toString();
      return this.addressService.getProvinces();
    })).subscribe((provinces: any[]) => {
      this.provinces = provinces;
      if (this.customer.ward !== null) {
        let province = this.customer.ward.district.province.code;
        this.province = `${province}`;
        this.addressService.getDistricts(province).pipe(switchMap((districts: any[]) => {
          this.districts = districts;
          let district = this.customer.ward.district.code;
          this.district = `${district}`;
          return this.addressService.getWards(district);
        })).subscribe((wards: any[]) => {
          this.wards = wards;
          this.ward = `${this.customer.ward.code}`;
        });
      }
    });
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
            this.isUploaded = false;
          }
        }

        reader.readAsDataURL(file);
      }
    }
  }

  onUpdateCustomer(updateCustomer: NgForm) {
    of(this.isUploaded)
      .pipe(switchMap((b: boolean) => b ? of(this.image.substring(33)) : this.fileService.upload(this.image).pipe(map((image: any) => image.url))))
      .subscribe((image: string) => {
        let {fullName: name, phone, gender} = updateCustomer.value;
        let customer = {
          name, gender, image, phone,
          role: this.role,
          birthday: this.birthday,
          ward: parseInt(this.ward)
        }

        this.customerService.updateCustomer(this.id, customer).subscribe((res: HttpResponse<any>) => {
          if (res.status === 200) {
            let redirect = this.role == "1" ? "/staffs" : "/customers";
            this.router.navigate(["/user" + redirect]);
          }
        });
      });
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
