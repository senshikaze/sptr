import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  template: `
    <ul *ngIf="pages > 1" class="flex">
      <li class="cursor-pointer p-1 hover:text-blue" title="First Page: 1" (click)="pageChange(1)">&lt;&lt;</li>
      <li class="cursor-pointer p-1 hover:text-blue" title="Previous Page: {{prev}}" (click)="pageChange(page - 1)">&lt;</li>
      <li class="cursor-pointer p-1 hover:text-blue" title="Current page">{{this.page}} / {{this.pages}}</li>
      <li class="cursor-pointer p-1 hover:text-blue" title="Next Page: {{next}}" (click)="pageChange(page + 1)">&gt;</li>
      <li class="cursor-pointer p-1 hover:text-blue" title="Last Page: {{pages}}" (click)="pageChange(pages)">&gt;&gt;</li>
    </ul>
  `
})
export class PaginatorComponent implements OnInit {
  @Input() page!: number;
  @Input() limit!: number;
  @Input() total!: number;

  pages: number = 1;
  next: number = 1;
  prev: number = 1;


  @Output() pageChangeEvent = new EventEmitter<{newPage: number}>();

  ngOnInit() {
    this.pages = Math.ceil(this.total / this.limit);
    if (this.pages != 1) {
      this.next = this.page + 1;
    }
    if (this.page != 1) {
      this.prev = this.page - 1;
    }
  }

  pageChange(newPage: number) {
    this.pageChangeEvent.emit({newPage: newPage});
  }
}
