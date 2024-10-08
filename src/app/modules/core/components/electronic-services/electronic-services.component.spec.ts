import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectronicServicesComponent } from './electronic-services.component';

describe('ElectronicServicesComponent', () => {
  let component: ElectronicServicesComponent;
  let fixture: ComponentFixture<ElectronicServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectronicServicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectronicServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
