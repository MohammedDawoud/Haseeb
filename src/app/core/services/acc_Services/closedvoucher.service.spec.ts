import { TestBed } from '@angular/core/testing';

import { ClosedvoucherService } from './closedvoucher.service';

describe('ClosedvoucherService', () => {
  let service: ClosedvoucherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClosedvoucherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
