import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceAndDepartureOfEmployeesComponent } from './attendance-and-departure-of-employees.component';

describe('AttendanceAndDepartureOfEmployeesComponent', () => {
  let component: AttendanceAndDepartureOfEmployeesComponent;
  let fixture: ComponentFixture<AttendanceAndDepartureOfEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceAndDepartureOfEmployeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceAndDepartureOfEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
