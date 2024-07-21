import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdoptionOfThemanagerComponent } from './adoption-of-themanager.component';

describe('AdoptionOfThemanagerComponent', () => {
  let component: AdoptionOfThemanagerComponent;
  let fixture: ComponentFixture<AdoptionOfThemanagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdoptionOfThemanagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdoptionOfThemanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
