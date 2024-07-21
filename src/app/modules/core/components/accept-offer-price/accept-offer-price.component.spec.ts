import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptOfferPriceComponent } from './accept-offer-price.component';

describe('AcceptOfferPriceComponent', () => {
  let component: AcceptOfferPriceComponent;
  let fixture: ComponentFixture<AcceptOfferPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptOfferPriceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptOfferPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
