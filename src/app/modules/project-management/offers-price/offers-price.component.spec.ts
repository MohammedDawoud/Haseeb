import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersPriceComponent } from './offers-price.component';

describe('OffersPriceComponent', () => {
  let component: OffersPriceComponent;
  let fixture: ComponentFixture<OffersPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffersPriceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
