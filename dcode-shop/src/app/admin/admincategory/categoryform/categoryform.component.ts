import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categoryform',
  templateUrl: './categoryform.component.html',
  styleUrls: ['./categoryform.component.scss']
})
export class CategoryformComponent implements OnInit {

  categoryId: number = 0;

  isAdd: boolean = false;
  isEdit: boolean = false;

  constructor(private router: Router) {
    this.isAdd = this.router.getCurrentNavigation()?.extras.state?.mode === 'add';
    this.isEdit = this.router.getCurrentNavigation()?.extras.state?.mode === 'edit';
    this.categoryId = +this.router.getCurrentNavigation()?.extras.state?.id;
  }

  ngOnInit(): void {
  }

  onSubmit() {
  }

  getTitleText(): string {
    if(this.isAdd) {
      return "Categorie Toevoegen";
    }
    else {
      return "Categorie Wijzigen";
    }
  }

  getSubmitButtonText(): string {
    if(this.isAdd) {
      return "Toevoegen";
    }
    else {
      return "Opslaan";
    }
  }

}
