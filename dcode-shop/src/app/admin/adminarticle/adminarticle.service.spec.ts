import { TestBed } from '@angular/core/testing';

import { AdminarticleService } from './adminarticle.service';

describe('AdminarticleService', () => {
  let service: AdminarticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminarticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
