import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../admin/adminarticle/article';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-recommendeditem',
  templateUrl: './recommendeditem.component.html',
  styleUrls: ['./recommendeditem.component.scss']
})
export class RecommendeditemComponent implements OnInit {

  baseImgUrl = GlobalConstants.baseImgUrl

  @Input() articleImg: string = "coming-soon_l5vdo3.webp";
  @Input() articleId: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
