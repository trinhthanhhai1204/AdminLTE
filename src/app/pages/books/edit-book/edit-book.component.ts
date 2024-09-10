import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormsModule, NgForm} from "@angular/forms";
import {NgClass, NgForOf} from "@angular/common";
import {BookService} from "../../../services/book.service";
import {CategoryService} from "../../../services/category.service";
import {map, of, switchMap} from "rxjs";
import {FileService} from "../../../services/file.service";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [FormsModule, NgForOf, RouterLink, NgClass],
  templateUrl: './edit-book.component.html'
})
export class EditBookComponent implements OnInit {
  id!: number;
  name!: string;
  price!: number;
  description!: string;
  allCategories: any[] = [];
  categoriesShow: any[] = [];
  search: string = "";
  image!: string;
  isUploaded: boolean = true;
  wasValidated: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private bookService: BookService, private categoryService: CategoryService, private fileService: FileService, private router: Router, private toastService: ToastService) {}

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap(({id}) => {
        this.id = parseInt(id);
        return this.bookService.getBookById(this.id);
      }),
      switchMap((book: any) => {
        this.name = book.name;
        this.price = book.price;
        this.description = book.description;
        this.image = book.image;
        return this.categoryService.getAllCategories();
      }),
      switchMap((categories: any[]) => {
        this.allCategories = categories;
        return this.categoryService.getCategoriesByBookId(this.id);
      }),
      map((categories: any[]) => categories.map((category: any) => category.id))
    ).subscribe((numbers: number[]) => {
      this.allCategories = this.allCategories.map((category: any) => {
        category.selected = numbers.includes(category.id);
        return category;
      });
      this.onUpdateCheckboxShow();
    });
  }

  onEditBook(editBook: NgForm) {
    this.wasValidated = true;

    if (editBook.valid) {
      of(this.isUploaded)
        .pipe(
          switchMap((b: boolean) => b ? of(this.image.substring(33)) : this.fileService.upload(this.image).pipe(
            map((image: any) => image.url)
          ))
        )
        .subscribe((image: string) => {
          let {name, price, description} = editBook.value;
          let categories: number[] = this.allCategories
            .filter((category: any) => category.selected)
            .map((category: any) => category.id);

          let book: any = {
            name, price, description, image, categories
          }
          this.bookService.updateBook(this.id, book).subscribe(() => {
            this.toastService.makeSuccessToast("Đã cập nhật thông tin truyện thành công!");
            this.router.navigate(['/books']);
          });
        });
    }
    else {
      this.toastService.makeErrorToast("Các trường chưa được nhập hợp lệ!");
    }

  }

  onCategoryChange($event: Event) {
    let target = $event.target as HTMLInputElement;
    this.allCategories = this.allCategories.map((category: any) => {
      if (category.id === parseInt(target.value)) {
        category.selected = target.checked;
      }
      return category;
    });

    this.onUpdateCheckboxShow();
  }

  onUpdateCheckboxShow() {
    this.categoriesShow = this.allCategories
      .filter((item: any) => item.name.toLowerCase().includes(this.search.toLowerCase()));
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
