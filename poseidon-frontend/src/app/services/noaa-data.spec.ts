import { TestBed } from '@angular/core/testing';

import { NoaaData } from './noaa-data';

describe('NoaaData', () => {
  let service: NoaaData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoaaData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
