import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiscalYearsComponent } from './fiscal-years.component';

describe('FiscalYearsComponent', () => {
  let component: FiscalYearsComponent;
  let fixture: ComponentFixture<FiscalYearsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiscalYearsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiscalYearsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
