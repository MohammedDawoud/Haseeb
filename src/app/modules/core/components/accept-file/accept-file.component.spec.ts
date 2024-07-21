import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptFileComponent } from './accept-file.component';

describe('AcceptFileComponent', () => {
  let component: AcceptFileComponent;
  let fixture: ComponentFixture<AcceptFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
