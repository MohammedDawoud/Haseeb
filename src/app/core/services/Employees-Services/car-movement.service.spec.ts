import { TestBed } from '@angular/core/testing';

import { CarMovementService } from './car-movement.service';

describe('CarMovementService', () => {
  let service: CarMovementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarMovementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
