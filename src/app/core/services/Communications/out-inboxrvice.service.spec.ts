import { TestBed } from '@angular/core/testing';

import { OutInboxrviceService } from './out-inboxrvice.service';

describe('OutInboxrviceService', () => {
  let service: OutInboxrviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutInboxrviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
