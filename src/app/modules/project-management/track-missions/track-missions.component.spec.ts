import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackMissionsComponent } from './track-missions.component';

describe('TrackMissionsComponent', () => {
  let component: TrackMissionsComponent;
  let fixture: ComponentFixture<TrackMissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackMissionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackMissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
