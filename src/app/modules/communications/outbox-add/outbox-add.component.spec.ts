import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboxAddComponent } from './outbox-add.component';

describe('OutboxAddComponent', () => {
  let component: OutboxAddComponent;
  let fixture: ComponentFixture<OutboxAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutboxAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutboxAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
