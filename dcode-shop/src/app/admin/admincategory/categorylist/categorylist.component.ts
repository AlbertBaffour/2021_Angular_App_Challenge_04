import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/shared/category.service';
import { Category } from '../category';

@Component({
  selector: 'app-categorylist',
  templateUrl: './categorylist.component.html',
  styleUrls: ['./categorylist.component.scss']
})
export class CategorylistComponent implements OnInit {

  categories: Category[] = [];

  constructor(private router: Router, private categoryService: CategoryService) { }

  ngOnInit(): void {
  }

  add() {
    this.router.navigate(['admin/categories/form'], { state: { mode: 'add' } });
  }

  edit(id: number) {
    this.router.navigate(['admin/categories/form'], { state: { id: id, mode: 'edit' } });
  }

  delete(id: number) {

  }

  getCategories() {

  }

}
