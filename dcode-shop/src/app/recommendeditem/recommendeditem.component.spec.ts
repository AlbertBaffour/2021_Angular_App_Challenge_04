import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendeditemComponent } from './recommendeditem.component';

describe('RecommendeditemComponent', () => {
  let component: RecommendeditemComponent;
  let fixture: ComponentFixture<RecommendeditemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendeditemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendeditemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
