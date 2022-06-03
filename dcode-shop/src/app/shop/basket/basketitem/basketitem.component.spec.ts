import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketitemComponent } from './basketitem.component';

describe('BasketitemComponent', () => {
  let component: BasketitemComponent;
  let fixture: ComponentFixture<BasketitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasketitemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
