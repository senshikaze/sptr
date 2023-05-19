import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitComponent } from './transit.component';

describe('TransitComponent', () => {
  let component: TransitComponent;
  let fixture: ComponentFixture<TransitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransitComponent]
    });
    fixture = TestBed.createComponent(TransitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
