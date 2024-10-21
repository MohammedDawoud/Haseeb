import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendenceLocationListComponent } from './attendence-location-list.component';

describe('AttendenceLocationListComponent', () => {
  let component: AttendenceLocationListComponent;
  let fixture: ComponentFixture<AttendenceLocationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendenceLocationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendenceLocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
