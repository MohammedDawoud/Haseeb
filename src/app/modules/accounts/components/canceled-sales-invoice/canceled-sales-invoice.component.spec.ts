import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanceledSalesInvoiceComponent } from './canceled-sales-invoice.component';

describe('CanceledSalesInvoiceComponent', () => {
  let component: CanceledSalesInvoiceComponent;
  let fixture: ComponentFixture<CanceledSalesInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanceledSalesInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanceledSalesInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
