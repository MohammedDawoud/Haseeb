import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenteeStaffComponent } from './absentee-staff.component';

describe('AbsenteeStaffComponent', () => {
  let component: AbsenteeStaffComponent;
  let fixture: ComponentFixture<AbsenteeStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbsenteeStaffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsenteeStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
