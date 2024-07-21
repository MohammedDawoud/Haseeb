import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementOfCustomersDeferredBalancesComponent } from './statement-of-customers-deferred-balances.component';

describe('StatementOfCustomersDeferredBalancesComponent', () => {
  let component: StatementOfCustomersDeferredBalancesComponent;
  let fixture: ComponentFixture<StatementOfCustomersDeferredBalancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatementOfCustomersDeferredBalancesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatementOfCustomersDeferredBalancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
