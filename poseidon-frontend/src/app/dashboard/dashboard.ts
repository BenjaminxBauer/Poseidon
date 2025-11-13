import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideCharts } from 'ng2-charts';
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { NoaaDataService } from '../services/noaa-data.service';
import { TideChartService } from '../services/tide-chart.service';
import { TidePrediction } from '../interface/tide-prediction-interface';
import { WindService } from '../services/wind-service';
import { MatGridListModule } from '@angular/material/grid-list';

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);


@Component({
  selector: 'app-dashboard',
  standalone: true,
  providers: [provideCharts()],
  imports: [CommonModule, BaseChartDirective, MatGridListModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})

export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  windData: any;
  tideChartConfig: any;
  unit: 'mph' | 'knots' = 'mph';
  windForecast: { speed: string; direction: string } | null = null;
  tideTime: string[] = [];
  tideHeight: number[] = [];

  constructor(
    private noaaService: NoaaDataService,
    private tideChartService: TideChartService,
    private windService: WindService
  ) {}

  ngOnInit(): void {
    this.noaaService.getHourlyForecast().subscribe(data => {
      const firstPeriod = data?.properties?.periods?.[0];
      if (firstPeriod) {
        this.windForecast = {
          speed: firstPeriod.windSpeed,
          direction: firstPeriod.windDirection
        };
      }
    });

    this.noaaService.getTidePredictions().subscribe(data => {
      this.tideTime = data.predictions.map((p: TidePrediction) => p.t);
      this.tideHeight = data.predictions.map((p: TidePrediction) => parseFloat(p.v));
      this.tideChartConfig = this.tideChartService.getChartConfig(this.tideTime, this.tideHeight);

      this.tideChartService.updateFlashingPoint(this.tideChartConfig, this.tideTime, this.tideHeight);
    setInterval(() => {
      this.tideChartService.updateFlashingPoint(this.tideChartConfig, this.tideTime, this.tideHeight);
    }, 500);
    });

  }

  toggleUnit(): void {
    this.unit = this.unit === 'mph' ? 'knots' : 'mph';
  }

  getWindSpeedDisplay(): string {
    if (!this.windForecast?.speed) return 'N/A';

    const rawSpeed = this.windForecast.speed;
    const match = rawSpeed.match(/(\d+)/);
    const mph = match ? +match[1] : 0;

    if (this.unit === 'knots') {
      const knots = this.windService.convertMphToKnots(mph);
      return `${knots} knots`;
    }

    return `${mph} mph`;
  }
}