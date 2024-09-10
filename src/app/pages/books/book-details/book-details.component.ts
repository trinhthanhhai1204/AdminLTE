import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {BookService} from "../../../services/book.service";
import {CategoryService} from "../../../services/category.service";
import {BookDetailsOptionsComponent} from "../book-details-options/book-details-options.component";
import {concatMap, from, switchMap} from "rxjs";
import {ImageService} from "../../../services/image.service";
import {FileService} from "../../../services/file.service";
import {VNDCurrencyPipe} from "../../../pipes/vnd-currency.pipe";

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    RouterLink,
    BookDetailsOptionsComponent,
    NgClass,
    VNDCurrencyPipe
  ],
  templateUrl: './book-details.component.html',
  styles: []
})
export class BookDetailsComponent implements OnInit {
  @ViewChild("imageFiles") imageFiles!: ElementRef;

  id!: number;
  name!: string;
  image!: string;
  price!: number;
  description!: string;
  categories: any[] = [];
  images: any[] = [];
  carouselItems: any[] = [];
  deleteImageRequestId: number = 0;
  base64List: string[] = [];
  previewDelete: string = "";
  viewImageRequestId: number = 0;
  viewImage: string = "";

  constructor(private activatedRoute: ActivatedRoute, private bookService: BookService, private categoryService: CategoryService, private imageService: ImageService, private fileService: FileService) {}

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap(({id}) => {
        this.id = parseInt(id);
        return this.bookService.getBookById(id);
      }),
      switchMap((book: any) => {
        this.name = book.name;
        this.image = book.image;
        this.price = book.price;
        this.description = book.description;
        return this.categoryService.getCategoriesByBookId(this.id);
      }),
      switchMap((categories: any[]) => {
        this.categories = categories;
        return this.imageService.getImagesByBookId(this.id);
      })
    ).subscribe((images: any[]) => {
      this.images = images;
      let carouselCount = Math.ceil(images.length / 4);
      for (let i = 0; i < carouselCount; i++) {
        let slice = images.slice(i * 4, i * 4 + 4);
        let carouselItem = slice.map((image: any) => image.src);
        this.carouselItems.push(carouselItem);
      }
    });
  }

  onChangeImage($event: MouseEvent) {
    let target = $event.target as HTMLImageElement;
    this.image = target.src;
  }

  onAddImageAction() {
    this.fileService.uploadMultiple(this.base64List).subscribe((images: string[]) => {
      from(images)
        .pipe(
          concatMap((image: any) => this.imageService.addImage({
            src: image, book: this.id
          })),
          switchMap(() => this.imageService.getImagesByBookId(this.id))
        )
        .subscribe((images: any[]) => {
        this.images = images;
        this.carouselItems = [];
        let carouselCount = Math.ceil(images.length / 4);
        for (let i = 0; i < carouselCount; i++) {
          let slice = images.slice(i * 4, i * 4 + 4);
          let carouselItem = slice.map((image: any) => image.src);
          this.carouselItems.push(carouselItem);
        }
      });
    });
    this.onCloseAddImageAction();
  }

  onDeleteImageRequest(id: number) {
    this.deleteImageRequestId = id;
    this.previewDelete = this.images.find((image: any) => image.id === this.deleteImageRequestId).src;
  }

  onDeleteImageAction() {
    this.imageService.deleteImage(this.deleteImageRequestId)
      .pipe(
        switchMap(() => this.imageService.getImagesByBookId(this.id))
      )
      .subscribe((images: any[]) => {
        this.images = images;
        this.carouselItems = [];
        let carouselCount = Math.ceil(images.length / 4);
        for (let i = 0; i < carouselCount; i++) {
          let slice = images.slice(i * 4, i * 4 + 4);
          let carouselItem = slice.map((image: any) => image.src);
          this.carouselItems.push(carouselItem);
        }
      })
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

  onCloseAddImageAction() {
    this.imageFiles.nativeElement.value = "";
    this.base64List = [];
  }

  onViewImage(id: number) {
    this.viewImageRequestId = id;
    this.viewImage = this.images.find((image: any) => image.id === id)?.src;
  }
}
