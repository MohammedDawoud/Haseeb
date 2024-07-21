import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxdeclarationComponent } from './taxdeclaration.component';

describe('TaxdeclarationComponent', () => {
  let component: TaxdeclarationComponent;
  let fixture: ComponentFixture<TaxdeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxdeclarationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxdeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
