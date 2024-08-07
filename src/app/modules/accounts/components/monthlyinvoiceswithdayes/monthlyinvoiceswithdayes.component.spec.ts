import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyinvoiceswithdayesComponent } from './monthlyinvoiceswithdayes.component';

describe('MonthlyinvoiceswithdayesComponent', () => {
  let component: MonthlyinvoiceswithdayesComponent;
  let fixture: ComponentFixture<MonthlyinvoiceswithdayesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyinvoiceswithdayesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyinvoiceswithdayesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
