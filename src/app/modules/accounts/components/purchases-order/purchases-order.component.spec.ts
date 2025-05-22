import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesOrderComponent } from './purchases-order.component';

describe('PurchasesOrderComponent', () => {
  let component: PurchasesOrderComponent;
  let fixture: ComponentFixture<PurchasesOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasesOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
