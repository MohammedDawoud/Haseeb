import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsTasksReportComponent } from './projects-tasks-report.component';

describe('ProjectsTasksReportComponent', () => {
  let component: ProjectsTasksReportComponent;
  let fixture: ComponentFixture<ProjectsTasksReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectsTasksReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsTasksReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
