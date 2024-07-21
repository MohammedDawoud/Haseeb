import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecksIssuedComponent } from './checks-issued.component';

describe('ChecksIssuedComponent', () => {
  let component: ChecksIssuedComponent;
  let fixture: ComponentFixture<ChecksIssuedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecksIssuedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecksIssuedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
