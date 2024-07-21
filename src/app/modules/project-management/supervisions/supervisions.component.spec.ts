import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisionsComponent } from './supervisions.component';

describe('SupervisionsComponent', () => {
  let component: SupervisionsComponent;
  let fixture: ComponentFixture<SupervisionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupervisionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupervisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
