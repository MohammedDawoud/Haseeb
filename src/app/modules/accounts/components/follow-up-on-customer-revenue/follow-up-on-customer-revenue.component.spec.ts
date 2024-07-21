import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpOnCustomerRevenueComponent } from './follow-up-on-customer-revenue.component';

describe('FollowUpOnCustomerRevenueComponent', () => {
  let component: FollowUpOnCustomerRevenueComponent;
  let fixture: ComponentFixture<FollowUpOnCustomerRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowUpOnCustomerRevenueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowUpOnCustomerRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
