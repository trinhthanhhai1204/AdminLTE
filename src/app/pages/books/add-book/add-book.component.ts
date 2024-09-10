import { Component } from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {NgClass, NgForOf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {BookService} from "../../../services/book.service";
import {CategoryService} from "../../../services/category.service";
import {FileService} from "../../../services/file.service";
import {map, of, switchMap} from "rxjs";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    RouterLink,
    NgClass
  ],
  templateUrl: './add-book.component.html',
  styles: ``
})
export class AddBookComponent {
  name: string = "";
  price: number = 0;
  description: string = "";
  image: string = "/assets/img/image-placeholder.jpg";
  base64List: string[] = [];
  allCategories: any[] = [];
  categoriesShow: any[] = [];
  search: string = "";
  wasValidated: boolean = false;

  constructor(private bookService: BookService, private categoryService: CategoryService,private fileService: FileService, private router: Router, private toastService: ToastService) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((categories: any[]) => {
      this.allCategories = categories.map((category: any) => {
        category.selected = false;
        return category;
      });
      this.onUpdateCheckboxShow();
    });
  }

  onAddBook(addBook: NgForm) {
    this.wasValidated = true;

    if (addBook.valid) {
      of(this.image).pipe(
        switchMap((image: string) => {
          return image !== "/assets/img/image-placeholder.jpg" ?
            this.fileService.upload(this.image).pipe(
              map((image: any) => image.url)
            ) :
            of("/images/image-placeholder.jpg");
        })
      ).subscribe((image: string) => {
        this.fileService.uploadMultiple(this.base64List).subscribe((images: string[]) => {
          let {name, price, description} = addBook.value;
          let categories: number[] = this.allCategories
            .filter((category: any) => category.selected)
            .map((category: any) => category.id);

          let book: any = {
            name: name,
            price: price,
            description: description,
            image: image,
            categories: categories,
            images: images
          };

          this.bookService.saveBook(book).subscribe((book: any) => {
            this.toastService.makeSuccessToast("Đã thêm truyện thành công!");
            this.router.navigate([`/books/${book.id}`]);
          });
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

  onChangeImages($event: Event) {
    let target = $event.target as HTMLInputElement;
    if (target.files) {
      let files = target.files;
      for (let i = 0; i < files.length; i++) {
        let file = files[i];

        let reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>)  => {
          if (e.target) {
            this.base64List.push(e.target.result as string);
          }
        }

        reader.readAsDataURL(file);
      }
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
