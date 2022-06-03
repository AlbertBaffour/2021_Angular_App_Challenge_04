import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {ArticleService} from "./article.service";
import {CategoryService} from "./category.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { SearchFilterPipe } from './search-filter.pipe';
import {LoadingComponent} from "./loading/loading.component";
import { PaginationComponent } from './pagination/pagination.component';
import { ToastrModule } from 'ngx-toastr';
import {DataTablesModule} from "angular-datatables";

@NgModule({
  declarations: [
    SearchFilterPipe,
    LoadingComponent,
    PaginationComponent,
  ],
  exports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SearchFilterPipe,
    LoadingComponent,
    PaginationComponent,
    DataTablesModule
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    DataTablesModule
  ],
  providers: [
    ArticleService,
    CategoryService
  ]
})
export class SharedModule { }
