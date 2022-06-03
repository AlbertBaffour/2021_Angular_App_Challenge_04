import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopheaderComponent } from './shopheader.component';

describe('ShopheaderComponent', () => {
  let component: ShopheaderComponent;
  let fixture: ComponentFixture<ShopheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopheaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
