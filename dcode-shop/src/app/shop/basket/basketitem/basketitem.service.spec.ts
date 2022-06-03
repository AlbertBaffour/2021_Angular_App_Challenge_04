import { TestBed } from '@angular/core/testing';

import { BasketitemService } from './basketitem.service';

describe('BasketitemService', () => {
  let service: BasketitemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasketitemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
