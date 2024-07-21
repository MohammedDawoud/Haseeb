import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowProjectComponent } from './follow-project.component';

describe('FollowProjectComponent', () => {
  let component: FollowProjectComponent;
  let fixture: ComponentFixture<FollowProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
