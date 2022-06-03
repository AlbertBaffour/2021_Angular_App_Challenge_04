import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ArticleService } from 'src/app/shared/article.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() totalArticles: number = 0;
  @Input() category: string = "";
  @Input() sortBy: string = "name-asc";
  @Input() priceLow:number=0;
  @Input() priceHigh:number=0;
  @Input() inStock:number= 1;
  brands:string[]=[]
  selectedbrands:string[]=[]
  stock:boolean=false;


  @Output() getArticles = new EventEmitter<{ page: string, sort: string, order: string , selectedBrands:string[],priceLow:number,priceHigh:number,inStock:number }>();

  brands$: Subscription = new Subscription();
  constructor(private articleService:ArticleService) { }

  ngOnInit(): void {
    this.GetBrands()
    //this.toonOutOfStock(true)
  }

  brandSelect(brand:string){
    if(this.selectedbrands.includes(brand)){
      var index = this.selectedbrands.indexOf(brand);
      this.selectedbrands.splice(index,1)
  }else{this.selectedbrands.push(brand)}
}

  filter(){
    let split = this.sortBy.split("-");
    this.getArticles.emit({page: "pass", sort: split[0], order: split[1],selectedBrands :this.selectedbrands, priceLow:this.priceLow,priceHigh:this.priceHigh,inStock:this.inStock});
  }
  GetBrands() {
    this.brands$ = this.articleService.getAllBrands().subscribe(results => {
      this.brands = results;
    });
  }
  toonOutOfStock(){
    if(!this.stock){
    this.stock=true;
    this.inStock=0;
  }else{
    this.inStock=1;
    this.stock=false
  }
  }
  ngOnDestroy(): void {
    this.brands$.unsubscribe();
  }
}
