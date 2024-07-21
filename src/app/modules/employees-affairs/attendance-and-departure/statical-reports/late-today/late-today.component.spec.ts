import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LateTodayComponent } from './late-today.component';

describe('LateTodayComponent', () => {
  let component: LateTodayComponent;
  let fixture: ComponentFixture<LateTodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LateTodayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LateTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
