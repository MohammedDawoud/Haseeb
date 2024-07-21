import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningEntryComponent } from './opening-entry.component';

describe('OpeningEntryComponent', () => {
  let component: OpeningEntryComponent;
  let fixture: ComponentFixture<OpeningEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpeningEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpeningEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
