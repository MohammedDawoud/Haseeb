import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRevenueComponent } from './customer-revenue.component';

describe('CustomerRevenueComponent', () => {
  let component: CustomerRevenueComponent;
  let fixture: ComponentFixture<CustomerRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerRevenueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
