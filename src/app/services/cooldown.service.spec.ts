import { TestBed } from '@angular/core/testing';

import { CooldownService } from './cooldown.service';

describe('CooldownService', () => {
  let service: CooldownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CooldownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
