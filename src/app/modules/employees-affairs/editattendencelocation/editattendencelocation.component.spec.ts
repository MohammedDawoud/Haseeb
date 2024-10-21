import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditattendencelocationComponent } from './editattendencelocation.component';

describe('EditattendencelocationComponent', () => {
  let component: EditattendencelocationComponent;
  let fixture: ComponentFixture<EditattendencelocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditattendencelocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditattendencelocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
