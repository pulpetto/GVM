import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { workoutEditGuard } from './workout-edit.guard';

describe('workoutEditGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => workoutEditGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
