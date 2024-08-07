import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyinvoiceswitMonthsComponent } from './yearlyinvoiceswit-months.component';

describe('YearlyinvoiceswitMonthsComponent', () => {
  let component: YearlyinvoiceswitMonthsComponent;
  let fixture: ComponentFixture<YearlyinvoiceswitMonthsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearlyinvoiceswitMonthsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearlyinvoiceswitMonthsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
