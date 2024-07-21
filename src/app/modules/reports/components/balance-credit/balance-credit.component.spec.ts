import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceCreditComponent } from './balance-credit.component';

describe('BalanceCreditComponent', () => {
  let component: BalanceCreditComponent;
  let fixture: ComponentFixture<BalanceCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceCreditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
