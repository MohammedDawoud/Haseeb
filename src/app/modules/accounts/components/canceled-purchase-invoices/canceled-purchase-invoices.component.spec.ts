import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanceledPurchaseInvoicesComponent } from './canceled-purchase-invoices.component';

describe('CanceledPurchaseInvoicesComponent', () => {
  let component: CanceledPurchaseInvoicesComponent;
  let fixture: ComponentFixture<CanceledPurchaseInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanceledPurchaseInvoicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanceledPurchaseInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
