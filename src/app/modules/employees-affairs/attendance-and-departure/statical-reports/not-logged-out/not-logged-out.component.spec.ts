import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotLoggedOutComponent } from './not-logged-out.component';

describe('NotLoggedOutComponent', () => {
  let component: NotLoggedOutComponent;
  let fixture: ComponentFixture<NotLoggedOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotLoggedOutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotLoggedOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
