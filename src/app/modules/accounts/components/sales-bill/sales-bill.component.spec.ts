import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBillComponent } from './sales-bill.component';

describe('SalesBillComponent', () => {
  let component: SalesBillComponent;
  let fixture: ComponentFixture<SalesBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesBillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
