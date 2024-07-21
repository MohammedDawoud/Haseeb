import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpOnCreditAndDebitNotesComponent } from './follow-up-on-credit-and-debit-notes.component';

describe('FollowUpOnCreditAndDebitNotesComponent', () => {
  let component: FollowUpOnCreditAndDebitNotesComponent;
  let fixture: ComponentFixture<FollowUpOnCreditAndDebitNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowUpOnCreditAndDebitNotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowUpOnCreditAndDebitNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
