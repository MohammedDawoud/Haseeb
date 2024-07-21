import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarMovementComponent } from './car-movement.component';

describe('CarMovementComponent', () => {
  let component: CarMovementComponent;
  let fixture: ComponentFixture<CarMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarMovementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
