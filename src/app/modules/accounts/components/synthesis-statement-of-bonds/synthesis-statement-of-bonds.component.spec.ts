import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthesisStatementOfBondsComponent } from './synthesis-statement-of-bonds.component';

describe('SynthesisStatementOfBondsComponent', () => {
  let component: SynthesisStatementOfBondsComponent;
  let fixture: ComponentFixture<SynthesisStatementOfBondsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SynthesisStatementOfBondsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SynthesisStatementOfBondsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
