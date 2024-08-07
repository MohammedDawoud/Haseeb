import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyInvoicesComponent } from './monthly-invoices.component';

describe('MonthlyInvoicesComponent', () => {
  let component: MonthlyInvoicesComponent;
  let fixture: ComponentFixture<MonthlyInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyInvoicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
