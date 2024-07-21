import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploaderCenterNewComponent } from './file-uploader-center-new.component';

describe('FileUploaderCenterNewComponent', () => {
  let component: FileUploaderCenterNewComponent;
  let fixture: ComponentFixture<FileUploaderCenterNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileUploaderCenterNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileUploaderCenterNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
