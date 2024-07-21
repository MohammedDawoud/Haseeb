import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LateEmployeesComponent } from './late-employees.component';

describe('LateEmployeesComponent', () => {
  let component: LateEmployeesComponent;
  let fixture: ComponentFixture<LateEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LateEmployeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LateEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
