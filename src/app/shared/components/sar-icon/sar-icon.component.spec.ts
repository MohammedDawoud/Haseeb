import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SarIconComponent } from './sar-icon.component';

describe('SarIconComponent', () => {
  let component: SarIconComponent;
  let fixture: ComponentFixture<SarIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SarIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SarIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
