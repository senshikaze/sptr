import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JumpComponent } from './jump.component';

describe('JumpComponent', () => {
  let component: JumpComponent;
  let fixture: ComponentFixture<JumpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JumpComponent]
    });
    fixture = TestBed.createComponent(JumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
