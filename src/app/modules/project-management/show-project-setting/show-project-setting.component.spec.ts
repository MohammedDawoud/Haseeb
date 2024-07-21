import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowProjectSettingComponent } from './show-project-setting.component';

describe('ShowProjectSettingComponent', () => {
  let component: ShowProjectSettingComponent;
  let fixture: ComponentFixture<ShowProjectSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowProjectSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowProjectSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
