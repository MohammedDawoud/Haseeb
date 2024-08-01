import { TestBed } from '@angular/core/testing';

import { DebentureService } from './debenture.service';

describe('DebentureService', () => {
  let service: DebentureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DebentureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
