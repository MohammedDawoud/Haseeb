import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicedueComponent } from './invoicedue.component';

describe('InvoicedueComponent', () => {
  let component: InvoicedueComponent;
  let fixture: ComponentFixture<InvoicedueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicedueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicedueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
