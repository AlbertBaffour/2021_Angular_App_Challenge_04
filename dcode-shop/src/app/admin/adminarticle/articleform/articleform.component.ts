import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Article } from '../article';
import {ArticleService} from "../../../shared/article.service";
import { CategoryService } from 'src/app/shared/category.service';
import { Category } from '../../admincategory/category';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-articleform',
  templateUrl: './articleform.component.html',
  styleUrls: ['./articleform.component.scss']
})
export class ArticleformComponent implements OnInit, OnDestroy {

  isAdd: boolean = false;
  isEdit: boolean = false;
  articleId: number = 0;
  articles!: Article[];

  isSubmitted: boolean = false;
  errorMessage: string = "";

  categories!: Category[];
  categories$: Subscription = new Subscription();

  article$: Subscription = new Subscription();
  postArticle$: Subscription = new Subscription();
  putArticle$: Subscription = new Subscription();

  articles$: Subscription = new Subscription();

  article: Article = {id: 0, name: "", color: "", price: 0, isActive: false, description: "", categoryId: 1, quantityInStock: 0, brand: "", img: "", size: 0}

  constructor(private router: Router, private articleService: ArticleService, private categoryService: CategoryService, private toastrService: ToastrService) {
    this.isAdd = this.router.getCurrentNavigation()?.extras.state?.mode === 'add';
    this.isEdit = this.router.getCurrentNavigation()?.extras.state?.mode === 'edit';
    this.articleId = +this.router.getCurrentNavigation()?.extras.state?.id;

    if (this.articleId != 0) {
      this.article$ = this.articleService.getArticleById(this.articleId).subscribe(result => {
        this.article = result.data;
      })
    }
   }

  ngOnInit(): void {
    this.getCategories();
  }

  ngOnDestroy(): void {
    this.article$.unsubscribe();
    this.postArticle$.unsubscribe();
    this.putArticle$.unsubscribe();

  }

  getCategories() {
    this.categories$ = this.categoryService.getCategories().subscribe(result => {
      this.categories = result;
    })
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.isAdd) {
      this.article.img="coming-soon_l5vdo3.webp"
      this.postArticle$ = this.articleService.postArticle(this.article).subscribe(result => {
        this.showToasterSuccess();
        this.router.navigateByUrl("/admin/articles");
      },
      error => {
        this.errorMessage = error.message;
        this.showToasterError();
      });
    }

    if (this.isEdit) {
      this.putArticle$ = this.articleService.updateArticle(this.articleId, this.article).subscribe(result => {
        this.router.navigateByUrl("/admin/articles");
        this.showToasterSuccessEdit();
      },
      error => {
        this.errorMessage = error.message;
      });
    }
  }
  showToasterSuccess(){
    this.toastrService.success("Nieuw artikel succesvol aangemaakt")
  }

  showToasterSuccessEdit() {
    this.toastrService.success("Wijzigingen in artikel opgeslagen")
  }

  showToasterError(){
    this.toastrService.error("Er is iets misgegaan. Probeer later opnieuw")
  }

  showToasterInfo(){
    this.toastrService.info("This is info", "This is info")
  }

  showToasterWarning(){
    this.toastrService.warning("This is warning", "This is warning")
  }



}
