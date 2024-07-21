import { TestBed } from '@angular/core/testing';

import { PayVoucherService } from './pay-voucher.service';

describe('PayVoucherService', () => {
  let service: PayVoucherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayVoucherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
