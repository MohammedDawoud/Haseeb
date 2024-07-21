import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterMovementComponent } from './cost-center-movement.component';

describe('CostCenterMovementComponent', () => {
  let component: CostCenterMovementComponent;
  let fixture: ComponentFixture<CostCenterMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCenterMovementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostCenterMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
