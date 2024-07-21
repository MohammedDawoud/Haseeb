import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsArchiveComponent } from './projects-archive.component';

describe('ProjectsArchiveComponent', () => {
  let component: ProjectsArchiveComponent;
  let fixture: ComponentFixture<ProjectsArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectsArchiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
