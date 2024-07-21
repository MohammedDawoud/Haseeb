import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagersRevenueComponent } from './project-managers-revenue.component';

describe('ProjectManagersRevenueComponent', () => {
  let component: ProjectManagersRevenueComponent;
  let fixture: ComponentFixture<ProjectManagersRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectManagersRevenueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectManagersRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
