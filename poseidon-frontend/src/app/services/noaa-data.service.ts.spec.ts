import { TestBed } from '@angular/core/testing';

import { NoaaDataService } from './noaa-data.service.ts.js';

describe('NoaaDataService', () => {
  let service: NoaaDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoaaDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
