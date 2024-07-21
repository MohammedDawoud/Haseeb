import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationAttendanceComponent } from './application-attendance.component';

describe('ApplicationAttendanceComponent', () => {
  let component: ApplicationAttendanceComponent;
  let fixture: ComponentFixture<ApplicationAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationAttendanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
