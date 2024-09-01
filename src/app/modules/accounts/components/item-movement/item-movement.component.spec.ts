import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMovementComponent } from './item-movement.component';

describe('ItemMovementComponent', () => {
  let component: ItemMovementComponent;
  let fixture: ComponentFixture<ItemMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemMovementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
