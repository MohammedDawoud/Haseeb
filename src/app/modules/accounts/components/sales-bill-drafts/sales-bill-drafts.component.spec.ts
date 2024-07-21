import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBillDraftsComponent } from './sales-bill-drafts.component';

describe('SalesBillDraftsComponent', () => {
  let component: SalesBillDraftsComponent;
  let fixture: ComponentFixture<SalesBillDraftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesBillDraftsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesBillDraftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
