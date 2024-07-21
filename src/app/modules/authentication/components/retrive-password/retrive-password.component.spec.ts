import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrivePasswordComponent } from './retrive-password.component';

describe('RetrivePasswordComponent', () => {
  let component: RetrivePasswordComponent;
  let fixture: ComponentFixture<RetrivePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetrivePasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetrivePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
