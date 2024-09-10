import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {BookService} from "../../../services/book.service";
import {NgClass, NgForOf, UpperCasePipe} from "@angular/common";
import {CategoryService} from "../../../services/category.service";
import {FormsModule} from "@angular/forms";
import {switchMap} from "rxjs";
import {VNDCurrencyPipe} from "../../../pipes/vnd-currency.pipe";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterLink, NgForOf, FormsModule, NgClass, VNDCurrencyPipe, UpperCasePipe],
  templateUrl: './books.component.html',
  styles: []
})
export class BooksComponent implements OnInit {
  books: any[] = [];
  categories: any[] = [];
  category: string = "0";
  sort: string = "0";
  page: number = 0;
  pages: number = 0;
  count: number = 0;
  pagesSequence: number[] = [];
  size: number = 10;

  deleteRequestId: number = 0;
  deleteRequestType: boolean = false;
  protected readonly Math = Math;

  constructor(private bookService: BookService, private categoryService: CategoryService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.getCategories();
    this.getBooks();
    this.getPages();
  }

  onCategoryChange() {
    this.sort = "0";
    this.page = 0;
    this.getBooks();
    this.getPages();
  }

  onSortChange() {
    this.page = 0;
    this.getBooks();
  }

  getBooks() {
    let category = parseInt(this.category);
    let sort = parseInt(this.sort);
    this.bookService.getBooks(category, this.page, this.size, sort).subscribe((books: any[]) => {
      this.books = books;
    });
  }

  getCategories() {
    this.categoryService.getAllCategories().subscribe((categories: any[]) => {
      this.categories = categories;
    });
  }

  getPages() {
    let category = parseInt(this.category);
    this.bookService.getBooksCount(category).subscribe((count: number) => {
      this.getCountAction(count);
    });
  }

  setPage(i: number) {
    this.page = i;
    this.getBooks();
  }

  onPrevClick() {
    if (this.page != 0) {
      this.setPage(this.page - 1);
    }
  }

  onNextClick() {
    if (this.page != this.pages - 1) {
      this.setPage(this.page + 1);
    }
  }

  onDeleteBookRequest(id: number) {
    this.deleteRequestId = id;
    let filter = this.books.filter(book => book.id = id);
    this.deleteRequestType = filter.length != 0 ? !filter[0].deleted : true;
  }

  onDeleteBook() {
    this.bookService.deleteBook(this.deleteRequestId)
      .pipe(switchMap(() => {
        let category = parseInt(this.category);
        return this.bookService.getBooksCount(category);
      }))
      .subscribe((count: number) => {
        this.getCountAction(count);
        this.setPage(this.page * this.size >= this.count ? this.pages - 1 : this.page);
        let title = this.deleteRequestType ? "Đã xoá sách!" : "Đã khôi phục sách!";
        this.toastService.makeSuccessToast(title);
      });
  }

  getCountAction(count: number) {
    this.count = count;
    this.pages = Math.ceil(count / this.size);
    let sequence: number[] = [];
    for (let i = 0; i < this.pages; i++) {
      sequence.push(i + 1);
    }
    this.pagesSequence = sequence;
  }
}
