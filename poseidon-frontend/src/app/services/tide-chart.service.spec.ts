import { TestBed } from '@angular/core/testing';

import { TideChartService } from './tide-chart.service';

describe('TideChartService', () => {
  let service: TideChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TideChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
