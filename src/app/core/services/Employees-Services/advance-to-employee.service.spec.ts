import { TestBed } from '@angular/core/testing';

import { AdvanceToEmployeeService } from './advance-to-employee.service';

describe('AdvanceToEmployeeService', () => {
  let service: AdvanceToEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvanceToEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
