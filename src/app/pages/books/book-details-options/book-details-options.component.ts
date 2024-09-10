import {Component, Input, OnInit} from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {OptionService} from "../../../services/option.service";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-book-details-options',
  standalone: true,
  imports: [NgForOf, RouterLink, NgClass],
  templateUrl: './book-details-options.component.html',
  styles: ``
})
export class BookDetailsOptionsComponent implements OnInit {
  @Input() bookId!: number;
  options: any[] = [];
  page: number = 0;
  pages: number = 0;
  count: number = 0;
  pagesSequence: number[] = [];
  size: number = 10;
  protected readonly Math = Math;
  deleteRequestId: number = 0;

  constructor(private optionService: OptionService) {
  }

  ngOnInit(): void {
    this.getOptions();
    this.getPages();
  }

  getOptions() {
    this.optionService.getOptionsByBookId(this.bookId, this.page, this.size).subscribe((options: any[]) => {
      this.options = options;
    });
  }

  setPage(i: number) {
    this.page = i;
    this.getOptions();
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

  getPages() {
    this.optionService.getCountByBookId(this.bookId).subscribe((count: number) => {
      this.getCountAction(count);
    });
  }

  onDeleteOption() {
    console.log(this.deleteRequestId);
    this.optionService.deleteOption(this.deleteRequestId)
      .pipe(
        switchMap(() => this.optionService.getCountByBookId(this.bookId))
      ).subscribe((count: number) => {
      this.getCountAction(count);
      this.setPage(this.page * this.size >= this.count ? this.pages - 1 : this.page);
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

  onDeleteOptionRequest(id: number) {
    this.deleteRequestId = id;
  }
}
