import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JumpGateComponent } from './jump-gate.component';

describe('JumpGateComponent', () => {
  let component: JumpGateComponent;
  let fixture: ComponentFixture<JumpGateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JumpGateComponent]
    });
    fixture = TestBed.createComponent(JumpGateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
