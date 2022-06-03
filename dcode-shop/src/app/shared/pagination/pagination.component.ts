import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PaginationHeaders} from "../response/pagination-headers";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() headers: PaginationHeaders = {pageNumber: 0, firstPage: "", lastPage: "", nextPage: "", pageSize: 0, previousPage: "", totalPages: 0, totalRecords: 0};
  @Output() getArticles = new EventEmitter<{ page: string, sort: string, order: string, selectedBrands:string[],priceLow:number,priceHigh:number,inStock:number}>();


  constructor() { }

  ngOnInit(): void {
  }

  paginate(api: string){
    this.getArticles.emit({page: api, sort: "pass", order: "pass",selectedBrands:[],priceLow:0,priceHigh:0,inStock:1});
  }
}
