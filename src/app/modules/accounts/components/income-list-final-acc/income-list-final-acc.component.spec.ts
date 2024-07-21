import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeListFinalAccComponent } from './income-list-final-acc.component';

describe('IncomeListFinalAccComponent', () => {
  let component: IncomeListFinalAccComponent;
  let fixture: ComponentFixture<IncomeListFinalAccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomeListFinalAccComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeListFinalAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
