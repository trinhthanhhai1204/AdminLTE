import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-redirect-to-page-not-found',
  standalone: true,
  imports: [],
  template: ``,
  styles: ``
})
export class RedirectToPageNotFoundComponent implements OnInit {
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.router.navigate(["/404"]);
  }
}
