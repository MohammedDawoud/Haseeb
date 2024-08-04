import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferDebenturesComponent } from './transfer-debentures.component';

describe('TransferDebenturesComponent', () => {
  let component: TransferDebenturesComponent;
  let fixture: ComponentFixture<TransferDebenturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferDebenturesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferDebenturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
