import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyInvoiceWithDetailsComponent } from './daily-invoice-with-details.component';

describe('DailyInvoiceWithDetailsComponent', () => {
  let component: DailyInvoiceWithDetailsComponent;
  let fixture: ComponentFixture<DailyInvoiceWithDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyInvoiceWithDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyInvoiceWithDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
