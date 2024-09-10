import { Component } from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {NgClass, NgForOf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {CategoryService} from "../../../services/category.service";
import {FileService} from "../../../services/file.service";
import {map, of, switchMap} from "rxjs";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    RouterLink,
    NgClass
  ],
  templateUrl: './add-category.component.html',
  styles: ``
})
export class AddCategoryComponent {
  name: string = "";
  image: string = "/assets/img/image-placeholder.jpg";
  wasValidated: boolean = false;

  constructor(private categoryService: CategoryService, private fileService: FileService, private router: Router, private toastService: ToastService) {}

  onAddCategories(form: NgForm) {
    this.wasValidated = true;

    if (form.valid) {
      of(this.image).pipe(
        switchMap((image: string) => {
          return image !== "/assets/img/image-placeholder.jpg" ?
            this.fileService.upload(this.image).pipe(
              map((image: any) => image.url)
            ) :
            of("/images/image-placeholder.jpg");
        })
      ).subscribe((image: string) => {
        let {name} = form.value;
        let category = {name, image}
        this.categoryService.saveCategory(category).subscribe(() => {
          this.toastService.makeSuccessToast("Đã thêm danh mục thành công!");
          this.router.navigate(["/categories"]);
        });
      });
    }
    else {
      this.toastService.makeErrorToast("Các trường chưa được nhập hợp lệ!");
    }
  }

  onChangeImage($event: Event) {
    let target = $event.target as HTMLInputElement;
    if (target.files) {
      let files = target.files;
      if (files.length != 0) {
        let file = files[0];

        let reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>)  => {
          if (e.target) {
            this.image = e.target.result as string;
          }
        }

        reader.readAsDataURL(file);
      }
    }
  }
}
