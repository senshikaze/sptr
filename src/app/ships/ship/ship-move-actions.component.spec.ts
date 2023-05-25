import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipMoveActionsComponent } from './ship-move-actions.component';

describe('ShipMoveActionsComponent', () => {
  let component: ShipMoveActionsComponent;
  let fixture: ComponentFixture<ShipMoveActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShipMoveActionsComponent]
    });
    fixture = TestBed.createComponent(ShipMoveActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
