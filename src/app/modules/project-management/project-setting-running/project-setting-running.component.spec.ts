import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSettingRunningComponent } from './project-setting-running.component';

describe('ProjectSettingRunningComponent', () => {
  let component: ProjectSettingRunningComponent;
  let fixture: ComponentFixture<ProjectSettingRunningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectSettingRunningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectSettingRunningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
