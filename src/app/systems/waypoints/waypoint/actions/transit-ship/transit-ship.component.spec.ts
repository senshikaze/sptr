import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitShipComponent } from './transit-ship.component';

describe('TransitShipComponent', () => {
  let component: TransitShipComponent;
  let fixture: ComponentFixture<TransitShipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransitShipComponent]
    });
    fixture = TestBed.createComponent(TransitShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
