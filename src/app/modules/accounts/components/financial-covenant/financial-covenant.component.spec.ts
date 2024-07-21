import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialCovenantComponent } from './financial-covenant.component';

describe('FinancialCovenantComponent', () => {
  let component: FinancialCovenantComponent;
  let fixture: ComponentFixture<FinancialCovenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialCovenantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialCovenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
