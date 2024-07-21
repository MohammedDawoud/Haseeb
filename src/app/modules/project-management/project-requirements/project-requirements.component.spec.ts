import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRequirementsComponent } from './project-requirements.component';

describe('ProjectRequirementsComponent', () => {
  let component: ProjectRequirementsComponent;
  let fixture: ComponentFixture<ProjectRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectRequirementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
