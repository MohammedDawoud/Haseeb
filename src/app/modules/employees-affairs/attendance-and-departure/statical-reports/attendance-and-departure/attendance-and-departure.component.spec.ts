import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceAndDepartureComponent } from './attendance-and-departure.component';

describe('AttendanceAndDepartureComponent', () => {
  let component: AttendanceAndDepartureComponent;
  let fixture: ComponentFixture<AttendanceAndDepartureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceAndDepartureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceAndDepartureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
