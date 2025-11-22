import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideCharts } from 'ng2-charts';
import { BaseChartDirective } from 'ng2-charts';
import {
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
  windForecast: { speed: string; direction: string } | null = null;
  todayTideTime: string[] = [];
  todayTideHeight: number[] = [];
  tomorrowTideTime: string[] = [];
  tomorrowTideHeight: number[] = [];
  chartName: 'Tide Chart' | 'Wind Chart' = 'Tide Chart'
  chartDate: 'Today' | 'Tomorrow' = 'Today'

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

    const today = this.getDateString("today");
    
    this.noaaService.getTidePredictions(today).subscribe(data => {
      this.todayTideTime = data.predictions.map((p: TidePrediction) => p.t);
      this.todayTideHeight = data.predictions.map((p: TidePrediction) => parseFloat(p.v));
      this.tideChartConfig = this.tideChartService.getChartConfig(this.todayTideTime, this.todayTideHeight);

      this.tideChartService.updateFlashingPoint(this.tideChartConfig, this.todayTideTime, this.todayTideHeight);
      setInterval(() => {
        this.tideChartService.updateFlashingPoint(this.tideChartConfig, this.todayTideTime, this.todayTideHeight);
      }, 500);
    });
  }

  toggleChartType(): void {
    this.chartName = this.chartName === 'Tide Chart' ? 'Wind Chart' : 'Tide Chart';
  }

  toggleChartDate(): void {
    this.chartDate = this.chartDate === 'Today' ? 'Tomorrow' : 'Today'

    if (this.chartDate == 'Tomorrow' && this.tomorrowTideTime.length === 0) {
      this.getTomorrowTideChartData();
    } else if (this.chartDate == 'Tomorrow' && this.tomorrowTideTime.length > 0) {
      this.tideChartConfig = this.tideChartService.getChartConfig(this.tomorrowTideTime, this.tomorrowTideHeight);
    } else {
      this.tideChartConfig = this.tideChartService.getChartConfig(this.todayTideTime, this.todayTideHeight);
      this.tideChartService.updateFlashingPoint(this.tideChartConfig, this.todayTideTime, this.todayTideHeight);
      setInterval(() => {
        this.tideChartService.updateFlashingPoint(this.tideChartConfig, this.todayTideTime, this.todayTideHeight);
      }, 500);
    }
  }

  getTomorrowTideChartData(): void {
    const tomorrow = this.getDateString('tomorrow');

    this.noaaService.getTidePredictions(tomorrow).subscribe(data => {
      this.tomorrowTideTime = data.predictions.map((p: TidePrediction) => p.t);
      this.tomorrowTideHeight = data.predictions.map((p: TidePrediction) => parseFloat(p.v));
      this.tideChartConfig = this.tideChartService.getChartConfig(this.tomorrowTideTime, this.tomorrowTideHeight);
    });
  }

  getDateString(todayOrTomorrow: string): string {
    const date = new Date();

    if (todayOrTomorrow == 'tomorrow') {
      date.setDate(date.getDate() + 1);
    } else {
      date.setDate(date.getDate());
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
  }

  // getWindSpeedDisplay(): string {
  //   if (!this.windForecast?.speed) return 'N/A';

  //   const rawSpeed = this.windForecast.speed;
  //   const match = rawSpeed.match(/(\d+)/);
  //   const mph = match ? +match[1] : 0;

  //   return `${mph} mph`;
  // }
}