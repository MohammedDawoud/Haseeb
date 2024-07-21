import { TestBed } from '@angular/core/testing';

import { AttendenceAndDepartureService } from './attendence-and-departure.service';

describe('AttendenceAndDepartureService', () => {
  let service: AttendenceAndDepartureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendenceAndDepartureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
