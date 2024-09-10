import {Component, OnInit} from '@angular/core';
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {BookService} from "../../../services/book.service";
import {FileService} from "../../../services/file.service";
import {OptionService} from "../../../services/option.service";
import {map, of, switchMap} from "rxjs";
import {NgClass} from "@angular/common";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-edit-option',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgClass
  ],
  templateUrl: './edit-option.component.html',
  styles: ``
})
export class EditOptionComponent implements OnInit {
  id!: number;
  bookId!: number;
  bookName!: string;
  isUploaded: boolean = true;
  name: string = "";
  image: string = "/assets/img/image-placeholder.jpg";
  quantity: number = 0;
  wasValidated: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private bookService: BookService, private fileService: FileService, private optionService: OptionService, private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({id}) => {
      if (id != null) {
        this.id = parseInt(id);
        this.bookService.getBookByOptionId(this.id).subscribe((book) => {
          this.bookId = book.id;
          this.bookName = book.name;
          let option = book.options[0];
          this.name = option.name;
          this.image = option.image;
          this.quantity = option.quantity;
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

  onEditOption(editOption: NgForm) {
    this.wasValidated = true;

    if (editOption.valid) {
      of(this.isUploaded)
        .pipe(
          switchMap((b: boolean) => b ? of(this.image.substring(33)) : this.fileService.upload(this.image).pipe(map((image: any) => image.url)))
        )
        .subscribe((image: string) => {
          let {name, quantity} = editOption.value;
          let option = {
            name,
            quantity,
            image,
            book: this.bookId
          }
          this.optionService.updateOption(this.id, option).subscribe(() => {
            this.toastService.makeSuccessToast("Đã cập nhật thông tin tập truyện thành công!");
            this.router.navigate([`/books/${this.bookId}`]);
          })
        });
    }
    else {
      this.toastService.makeErrorToast("Các trường chưa được nhập hợp lệ!");
    }

  }
}
