import { TestBed } from '@angular/core/testing';

import { PrintreportsService } from './printreports.service';

describe('PrintreportsService', () => {
  let service: PrintreportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintreportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
