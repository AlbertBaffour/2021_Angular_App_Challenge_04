import { TestBed } from '@angular/core/testing';

import { EDService } from './ed.service';

describe('EDService', () => {
  let service: EDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
