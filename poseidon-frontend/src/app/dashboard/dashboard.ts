import { Component, OnInit, Inject } from '@angular/core';
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
import { NoaaDataService } from '../services/noaa-data.service.ts';

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

interface TidePrediction {
    t: string;
    v: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  providers: [provideCharts()],
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  windData: any;
  unit: 'mph' | 'knots' = 'mph'; // default to mph
  windForecast: { speed: string; direction: string } | null = null;
  tideLabels: string[] = [];
  tideData: number[] = [];

  tideChartConfig: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels: this.tideLabels,
      datasets: [
        {
          label: 'Tide Level (ft)',
          data: this.tideData,
          fill: true,
          borderColor: 'blue',
          backgroundColor: 'rgba(135,206,250,0.4)', // light blue fill
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: 'Time'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Water Level (ft)'
          }
        }
      }
    }
  };

  constructor(private noaaService: NoaaDataService) {}

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
      console.log('Raw tide data:', data);
      this.tideLabels = data.predictions.map((p: TidePrediction) => p.t);
      this.tideData = data.predictions.map((p: TidePrediction) => parseFloat(p.v));
      console.log('Labels:', this.tideLabels);
      console.log('Data:', this.tideData);
      this.tideChartConfig.data.labels = this.tideLabels;
      this.tideChartConfig.data.datasets[0].data = this.tideData;
    });
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