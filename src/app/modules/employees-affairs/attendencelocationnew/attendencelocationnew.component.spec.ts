import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendencelocationnewComponent } from './attendencelocationnew.component';

describe('AttendencelocationnewComponent', () => {
  let component: AttendencelocationnewComponent;
  let fixture: ComponentFixture<AttendencelocationnewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendencelocationnewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendencelocationnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
