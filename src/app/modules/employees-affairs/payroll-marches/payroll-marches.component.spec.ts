import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollMarchesComponent } from './payroll-marches.component';

describe('PayrollMarchesComponent', () => {
  let component: PayrollMarchesComponent;
  let fixture: ComponentFixture<PayrollMarchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollMarchesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollMarchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
