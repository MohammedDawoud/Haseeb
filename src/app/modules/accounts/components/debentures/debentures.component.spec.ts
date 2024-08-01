import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebenturesComponent } from './debentures.component';

describe('DebenturesComponent', () => {
  let component: DebenturesComponent;
  let fixture: ComponentFixture<DebenturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebenturesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebenturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
