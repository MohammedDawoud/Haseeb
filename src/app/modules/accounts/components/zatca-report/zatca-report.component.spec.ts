import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZatcaReportComponent } from './zatca-report.component';

describe('ZatcaReportComponent', () => {
  let component: ZatcaReportComponent;
  let fixture: ComponentFixture<ZatcaReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZatcaReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZatcaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
