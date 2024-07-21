import { TestBed } from '@angular/core/testing';

import { AccountsreportsService } from './accountsreports.service';

describe('AccountsreportsService', () => {
  let service: AccountsreportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountsreportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
