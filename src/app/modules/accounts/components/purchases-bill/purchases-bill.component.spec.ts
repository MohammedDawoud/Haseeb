import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesBillComponent } from './purchases-bill.component';

describe('PurchasesBillComponent', () => {
  let component: PurchasesBillComponent;
  let fixture: ComponentFixture<PurchasesBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasesBillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasesBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
