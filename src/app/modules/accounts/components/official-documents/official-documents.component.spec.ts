import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficialDocumentsComponent } from './official-documents.component';

describe('OfficialDocumentsComponent', () => {
  let component: OfficialDocumentsComponent;
  let fixture: ComponentFixture<OfficialDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficialDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficialDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
