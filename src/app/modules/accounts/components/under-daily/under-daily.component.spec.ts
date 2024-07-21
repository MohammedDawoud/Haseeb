import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderDailyComponent } from './under-daily.component';

describe('UnderDailyComponent', () => {
  let component: UnderDailyComponent;
  let fixture: ComponentFixture<UnderDailyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnderDailyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnderDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
