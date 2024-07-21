import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploaderCenterComponent } from './file-uploader-center.component';

describe('FileUploaderCenterComponent', () => {
  let component: FileUploaderCenterComponent;
  let fixture: ComponentFixture<FileUploaderCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileUploaderCenterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileUploaderCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
