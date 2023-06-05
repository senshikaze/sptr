import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JumpShipComponent } from './jump-ship.component';

describe('JumpShipComponent', () => {
  let component: JumpShipComponent;
  let fixture: ComponentFixture<JumpShipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JumpShipComponent]
    });
    fixture = TestBed.createComponent(JumpShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
