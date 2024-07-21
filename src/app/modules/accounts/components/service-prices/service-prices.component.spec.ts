import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePricesComponent } from './service-prices.component';

describe('ServicePricesComponent', () => {
  let component: ServicePricesComponent;
  let fixture: ComponentFixture<ServicePricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicePricesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicePricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
