import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesArchiveComponent } from './employees-archive.component';

describe('EmployeesArchiveComponent', () => {
  let component: EmployeesArchiveComponent;
  let fixture: ComponentFixture<EmployeesArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeesArchiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeesArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
