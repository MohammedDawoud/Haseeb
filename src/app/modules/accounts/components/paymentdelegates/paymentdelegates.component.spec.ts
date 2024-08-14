import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentdelegatesComponent } from './paymentdelegates.component';

describe('PaymentdelegatesComponent', () => {
  let component: PaymentdelegatesComponent;
  let fixture: ComponentFixture<PaymentdelegatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentdelegatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentdelegatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
