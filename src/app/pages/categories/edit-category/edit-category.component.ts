import {Component, OnInit} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {CategoryService} from "../../../services/category.service";
import {FileService} from "../../../services/file.service";
import {map, of, switchMap} from "rxjs";
import {ToastService} from "../../../services/toast.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgClass
  ],
  templateUrl: './edit-category.component.html',
  styles: ``
})
export class EditCategoryComponent implements OnInit {
  id!: number;
  name!: string;
  image!: string;
  isUploaded: boolean = true;
  wasValidated: boolean = false;

  constructor(private categoryService: CategoryService, private fileService: FileService, private activatedRoute: ActivatedRoute, private router: Router, private toastService: ToastService) {}

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap(({id}) => {
        this.id = parseInt(id);
        return this.categoryService.getCategoryById(this.id);
      })
    ).subscribe((category: any) => {
      this.name = category.name;
      this.image = `http://localhost:8080/api/v1/file${category.image}`;
    });
  }

  onEditCategory(editCategory: NgForm) {
    this.wasValidated = true;

    if (editCategory.valid) {
      of(this.isUploaded)
        .pipe(
          switchMap((b: boolean) => b ? of(this.image.substring(33)) : this.fileService.upload(this.image).pipe(
            map((image: any) => image.url)
          ))
        )
        .subscribe((image: string) => {
          let {name} = editCategory.value;
          let category = {name, image};
          this.categoryService.updateCategory(this.id, category).subscribe(() => {
            this.toastService.makeSuccessToast("Đã cập nhật thông tin danh mục thành công!");
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
}
