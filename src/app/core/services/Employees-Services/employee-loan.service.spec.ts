import { TestBed } from '@angular/core/testing';

import { EmployeeLoanService } from './employee-loan.service';

describe('EmployeeLoanService', () => {
  let service: EmployeeLoanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeLoanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
