import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackProjectsComponent } from './track-projects.component';

describe('TrackProjectsComponent', () => {
  let component: TrackProjectsComponent;
  let fixture: ComponentFixture<TrackProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackProjectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
