import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceToEmployeesComponent } from './advance-to-employees.component';

describe('AdvanceToEmployeesComponent', () => {
  let component: AdvanceToEmployeesComponent;
  let fixture: ComponentFixture<AdvanceToEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceToEmployeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceToEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
