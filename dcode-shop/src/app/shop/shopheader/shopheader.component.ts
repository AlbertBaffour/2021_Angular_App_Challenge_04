import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-shopheader',
  templateUrl: './shopheader.component.html',
  styleUrls: ['./shopheader.component.scss']
})
export class ShopheaderComponent implements OnInit {

  @Input() totalArticles: number = 0;
  @Input() category: string = "";
  @Input() sortBy: string = "name-asc";

  @Input() searched: boolean = false;

  @Output() getArticles = new EventEmitter<{ page: string, sort: string, order: string}>();

  constructor() { }

  ngOnInit(): void {
  }

  sort(){
    let split = this.sortBy.split("-");
    this.getArticles.emit({page: "pass", sort: split[0], order: split[1]});
  }
}
