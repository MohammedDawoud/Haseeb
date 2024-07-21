import { TestBed } from '@angular/core/testing';

import { EntryvoucherService } from './entryvoucher.service';

describe('EntryvoucherService', () => {
  let service: EntryvoucherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntryvoucherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
