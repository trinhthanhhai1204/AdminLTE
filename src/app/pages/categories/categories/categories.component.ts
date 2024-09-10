import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {CategoryService} from "../../../services/category.service";
import {switchMap} from "rxjs";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [NgForOf, ReactiveFormsModule, RouterLink, FormsModule, NgClass],
  templateUrl: './categories.component.html',
  styles: []
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  sort: string = "0";
  page: number = 0;
  pages: number = 0;
  count: number = 0;
  pagesSequence: number[] = [];
  size: number = 10;
  deleteRequestId: number = 0;
  deleteRequestType: boolean = false;
  protected readonly Math = Math;

  constructor(private categoryService: CategoryService, private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.getCategories();
    this.getPages();
  }

  onSortChange() {
    this.setPage(0);
  }

  getCategories() {
    let sort = parseInt(this.sort);
    this.categoryService.getCategories(this.page, this.size, sort).subscribe((categories: any[]) => {
      this.categories = categories;
    });
  }

  getPages() {
    this.categoryService.getCount().subscribe((count: number) => {
      this.getCountAction(count);
    });
  }

  setPage(i: number) {
    this.page = i;
    this.getCategories();
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

  onDeleteCategoryRequest(id: number) {
    this.deleteRequestId = id;
    let filter = this.categories.filter(category => category.id = id);
    this.deleteRequestType = filter.length != 0 ? !filter[0].deleted : true;
  }

  onDeleteCategory() {
    this.categoryService.deleteCategory(this.deleteRequestId)
      .pipe(switchMap(() => this.categoryService.getCount()))
      .subscribe((count: number) => {
        this.getCountAction(count);
        this.setPage(this.page * this.size >= this.count ? this.pages - 1 : this.page);
        let title = this.deleteRequestType ? "Đã xoá danh mục!" : "Đã khôi phục danh mục!";
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
