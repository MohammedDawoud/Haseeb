import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffcontractsComponent } from './staffcontracts.component';

describe('StaffcontractsComponent', () => {
  let component: StaffcontractsComponent;
  let fixture: ComponentFixture<StaffcontractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffcontractsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffcontractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
