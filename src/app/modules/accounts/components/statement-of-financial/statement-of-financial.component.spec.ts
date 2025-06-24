import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementOfFinancialComponent } from './statement-of-financial.component';

describe('StatementOfFinancialComponent', () => {
  let component: StatementOfFinancialComponent;
  let fixture: ComponentFixture<StatementOfFinancialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatementOfFinancialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatementOfFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
