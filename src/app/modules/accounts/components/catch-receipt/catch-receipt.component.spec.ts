import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatchReceiptComponent } from './catch-receipt.component';

describe('CatchReceiptComponent', () => {
  let component: CatchReceiptComponent;
  let fixture: ComponentFixture<CatchReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatchReceiptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatchReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
