import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseReturnComponent } from './expense-return.component';

describe('ExpenseReturnComponent', () => {
  let component: ExpenseReturnComponent;
  let fixture: ComponentFixture<ExpenseReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseReturnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
