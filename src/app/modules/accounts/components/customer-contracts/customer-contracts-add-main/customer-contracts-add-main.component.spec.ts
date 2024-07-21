import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerContractsAddMainComponent } from './customer-contracts-add-main.component';

describe('CustomerContractsAddMainComponent', () => {
  let component: CustomerContractsAddMainComponent;
  let fixture: ComponentFixture<CustomerContractsAddMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerContractsAddMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerContractsAddMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
