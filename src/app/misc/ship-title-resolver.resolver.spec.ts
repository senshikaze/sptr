import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { shipTitleResolverResolver } from './ship-title.resolver';

describe('shipTitleResolverResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => shipTitleResolverResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
