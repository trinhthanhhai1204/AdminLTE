import {Component, OnInit} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {NgClass, NgForOf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {BookService} from "../../../services/book.service";
import {map, of, switchMap} from "rxjs";
import {FileService} from "../../../services/file.service";
import {OptionService} from "../../../services/option.service";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-add-option',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    RouterLink,
    NgClass
  ],
  templateUrl: './add-option.component.html',
  styles: ``
})
export class AddOptionComponent implements OnInit {
  bookId!: number;
  bookName!: string;
  name: string = "";
  image: string = "/assets/img/image-placeholder.jpg";
  quantity: number = 0;
  wasValidated: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private bookService: BookService, private fileService: FileService, private optionService: OptionService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(({id}) => {
      if (id != null) {
        this.bookId = parseInt(id);
        this.bookService.getBookById(this.bookId).subscribe((book: any) => {
          this.bookName = book.name;
        });
      }
    });
  }

  onAddOption(addOption: NgForm) {
    this.wasValidated = true;

    if (addOption.valid) {
      of(this.image).pipe(
        switchMap((image: string) => {
          return image !== "/assets/img/image-placeholder.jpg" ?
            this.fileService.upload(this.image).pipe(
              map((image: any) => image.url)
            ) :
            of("/images/image-placeholder.jpg");
        })
      ).subscribe((image: string) => {
        let {name, quantity} = addOption.value;
        let option = {
          name,
          quantity,
          image,
          book: this.bookId
        }
        this.optionService.saveOption(option).subscribe(() => {
          this.toastService.makeSuccessToast("Đã thêm tập truyện thành công!");
          this.router.navigate([`/books/${this.bookId}`]);
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
