import { TestBed } from '@angular/core/testing';

import { ServiceAlertService } from './service-alert.service';

describe('ServiceAlertService', () => {
  let service: ServiceAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
