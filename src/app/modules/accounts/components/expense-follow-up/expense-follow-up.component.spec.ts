import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseFollowUpComponent } from './expense-follow-up.component';

describe('ExpenseFollowUpComponent', () => {
  let component: ExpenseFollowUpComponent;
  let fixture: ComponentFixture<ExpenseFollowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseFollowUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
