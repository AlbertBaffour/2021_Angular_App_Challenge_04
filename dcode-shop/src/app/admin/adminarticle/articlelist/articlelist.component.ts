import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Article } from '../article';
import {ArticleService} from "../../../shared/article.service";
import {LoadingService} from "../../../shared/loading/loading.service";
import { PaginationHeaders } from 'src/app/shared/response/pagination-headers';
import {LanguageApp} from "../../../shared/datatables/languages";
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-articlelist',
  templateUrl: './articlelist.component.html',
  styleUrls: ['./articlelist.component.scss']
})
export class ArticlelistComponent implements OnInit {

  baseImgUrl=GlobalConstants.baseImgUrl;
  articles: Article[] = [];
  articles$: Subscription = new Subscription();
  deleteArticle$: Subscription = new Subscription();
  headers: PaginationHeaders = {pageNumber: 0, firstPage: "", lastPage: "", nextPage: "", pageSize: 0, previousPage: "", totalPages: 0, totalRecords: 0};
  postArticle$: Subscription = new Subscription();
  putArticle$: Subscription = new Subscription();
  categoryId: number = 0;

  // Extra
  loading$ = this.loader.loading$;
  dtOptions: DataTables.Settings = {};

  article: Article = {id: 0, name: "", color: "", price: 0, isActive: false, description: "", categoryId: 1, quantityInStock: 0, brand: "", img: "", size: 0}

  constructor(private router: Router, private articleService: ArticleService, private loader: LoadingService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.dtOptions = {language: LanguageApp.dutch_datatables};
    this.loader.show();
    this.getArticles("", "name" ,"");
  }

  add() {
    this.router.navigate(['admin/articles/form'], {state: {mode: "add"}});
  }

  edit(id: number) {
    this.router.navigate(['admin/articles/form/' + id], {state: {id: id, mode: "edit"}})
  }

  delete(id: number) {
    if(confirm("Bent u zeker dat u dit artikel wilt verwijderen?")){
      this.deleteArticle$ = this.articleService.deleteArticle(id).subscribe(result => {
        this.getArticles("" , "name", "");
        this.showToasterDelete();
      });
    }
  }

  getArticles(page: string, sort: string, order: string) {
    if (page == ""){
      this.articles$ = this.articleService.getArticlesAdmin().subscribe(results => {
        this.articles=results
        this.loader.hide()
      });
    }else{
      this.articles$ = this.articleService.getArticlesByPage(page, "name", "").subscribe(results => {
        this.setResults(results);
        this.loader.hide()
      });
    }
  }

  setResults(results: any){
    this.headers.totalRecords = results.totalRecords;
    this.headers.totalPages = results.totalPages;
    this.headers.previousPage = results.previousPage;
    this.headers.pageSize = results.pageSize;
    this.headers.nextPage = results.nextPage;
    this.headers.lastPage = results.lastPage;
    this.headers.firstPage = results.firstPage;
    this.headers.pageNumber = results.pageNumber;

    this.articles = results.data;
  }

  showToasterDelete(){
    this.toastrService.success("Artikel succesvol verwijderd");
  }
}
