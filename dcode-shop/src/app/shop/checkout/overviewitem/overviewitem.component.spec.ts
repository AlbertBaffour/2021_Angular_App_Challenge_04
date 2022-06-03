import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewitemComponent } from './overviewitem.component';

describe('OverviewitemComponent', () => {
  let component: OverviewitemComponent;
  let fixture: ComponentFixture<OverviewitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverviewitemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
