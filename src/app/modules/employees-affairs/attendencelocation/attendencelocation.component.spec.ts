import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendencelocationComponent } from './attendencelocation.component';

describe('AttendencelocationComponent', () => {
  let component: AttendencelocationComponent;
  let fixture: ComponentFixture<AttendencelocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendencelocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendencelocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
