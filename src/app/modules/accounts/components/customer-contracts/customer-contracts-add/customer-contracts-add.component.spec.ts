import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerContractsAddComponent } from './customer-contracts-add.component';

describe('CustomerContractsAddComponent', () => {
  let component: CustomerContractsAddComponent;
  let fixture: ComponentFixture<CustomerContractsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerContractsAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerContractsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
