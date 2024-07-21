import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpRevenuesAndExpensesComponent } from './follow-up-revenues-and-expenses.component';

describe('FollowUpRevenuesAndExpensesComponent', () => {
  let component: FollowUpRevenuesAndExpensesComponent;
  let fixture: ComponentFixture<FollowUpRevenuesAndExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowUpRevenuesAndExpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowUpRevenuesAndExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
