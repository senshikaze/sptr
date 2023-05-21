import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipActionsComponent } from './ship-actions.component';

describe('ShipActionsComponent', () => {
  let component: ShipActionsComponent;
  let fixture: ComponentFixture<ShipActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShipActionsComponent]
    });
    fixture = TestBed.createComponent(ShipActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
