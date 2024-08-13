import { TestBed } from '@angular/core/testing';

import { BodyOverflowService } from './body-overflow.service';

describe('BodyOverflowService', () => {
  let service: BodyOverflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BodyOverflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
