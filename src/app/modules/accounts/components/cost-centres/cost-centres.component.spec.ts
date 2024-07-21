import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCentresComponent } from './cost-centres.component';

describe('CostCentresComponent', () => {
  let component: CostCentresComponent;
  let fixture: ComponentFixture<CostCentresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCentresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostCentresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
