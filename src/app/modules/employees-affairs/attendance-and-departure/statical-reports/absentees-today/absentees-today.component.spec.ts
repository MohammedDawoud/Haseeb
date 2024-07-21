import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenteesTodayComponent } from './absentees-today.component';

describe('AbsenteesTodayComponent', () => {
  let component: AbsenteesTodayComponent;
  let fixture: ComponentFixture<AbsenteesTodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbsenteesTodayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsenteesTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
