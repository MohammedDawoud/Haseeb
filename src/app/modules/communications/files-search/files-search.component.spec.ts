import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesSearchComponent } from './files-search.component';

describe('FilesSearchComponent', () => {
  let component: FilesSearchComponent;
  let fixture: ComponentFixture<FilesSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilesSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
