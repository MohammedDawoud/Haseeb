import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingNetworksComponent } from './outgoing-networks.component';

describe('OutgoingNetworksComponent', () => {
  let component: OutgoingNetworksComponent;
  let fixture: ComponentFixture<OutgoingNetworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutgoingNetworksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingNetworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
