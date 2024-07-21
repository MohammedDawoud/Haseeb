import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementOfFinancialPositionComponent } from './statement-of-financial-position.component';

describe('StatementOfFinancialPositionComponent', () => {
  let component: StatementOfFinancialPositionComponent;
  let fixture: ComponentFixture<StatementOfFinancialPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatementOfFinancialPositionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatementOfFinancialPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
