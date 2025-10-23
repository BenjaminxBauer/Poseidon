import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { NoaaDataService } from '../../services/noaa-data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  windData: any;
  tideData: any;
  isBrowser: boolean;
  unit: 'mph' | 'knots' = 'mph'; // default to mph
  windForecast: { speed: string; direction: string } | null = null;

  constructor(
    private noaaService: NoaaDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.noaaService.getHourlyForecast().subscribe(data => {
        const firstPeriod = data?.properties?.periods?.[0];
        if (firstPeriod) {
          this.windForecast = {
            speed: firstPeriod.windSpeed,
            direction: firstPeriod.windDirection
        };
    }
  });
      this.noaaService.getTidePredictions().subscribe(data => this.tideData = data);
    }
  }

  toggleUnit(): void {
    this.unit = this.unit === 'mph' ? 'knots' : 'mph';
  }

  convertMphToKnots(speedStr: string): number {
    const match = speedStr.match(/(\d+)\s*mph/);
    const mph = match ? +match[1] : 0;
    return +(mph / 1.15078).toFixed(2);
  }

  getWindSpeedDisplay(): string {
    if (!this.windForecast?.speed) return 'N/A';

    const rawSpeed = this.windForecast.speed;
    const match = rawSpeed.match(/(\d+)/);
    const mph = match ? +match[1] : 0;

    if (this.unit === 'knots') {
      const knots = +(mph / 1.15078).toFixed(2);
      return `${knots} knots`;
    }

    return `${mph} mph`;
  }
}
