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
  unit: 'mph' | 'knots' = 'mph';
  windForecast: { speed: string; direction: string } | null = null;
  tideLabels: string[] = [];
  tideData: number[] = [];
  pulseRadius: number = 10;
  pulseGrowing: boolean = true;

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
          backgroundColor: 'rgba(135,206,250,0.4)',
          tension: 0.4,
          pointRadius: 0
        },
        {
          label: 'Current Tide',
          data: [],
          pointBackgroundColor: 'rgba(0, 13, 255, 0.8)',
          pointBorderColor: 'rgba(255,255,255,0.6)',    
          pointRadius: 8,
          pointStyle: 'circle',
          showLine: false
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
          },
          ticks: {
            callback: (value: string | number, index: number) => {
              const label = typeof value === 'string' ? value : this.tideLabels[index];
              const date = new Date(label);
              const minutes = date.getMinutes();
              if (minutes === 0 || minutes === 30) {
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              }
              return '';
            },
            autoSkip: false
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

      this.updateFlashingPoint();
      setInterval(() => this.updateFlashingPoint(), 500);
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

  getCurrentTideIndex(): number | null {
    const now = new Date();
    const closestIndex = this.tideLabels.findIndex(label => {
      const labelTime = new Date(label);
      return Math.abs(labelTime.getTime() - now.getTime()) < 5 * 60 * 1000;
    });
    return closestIndex !== -1 ? closestIndex : null;
  }

  private updateFlashingPoint(): void {
    const currentIndex = this.getCurrentTideIndex();
    if (currentIndex !== -1 && currentIndex !== null) {
      const flashingData = new Array(this.tideLabels.length).fill(null);
      flashingData[currentIndex] = this.tideData[currentIndex];
      this.tideChartConfig.data.datasets[1].data = flashingData;

      if (this.pulseGrowing) {
        this.pulseRadius += 2;
        if (this.pulseRadius >= 14) this.pulseGrowing = false;
      } else {
        this.pulseRadius -= 2;
        if (this.pulseRadius <= 6) this.pulseGrowing = true;
      }

      this.tideChartConfig.data.datasets[1].pointRadius = this.pulseRadius;
      this.tideChartConfig.data.datasets[1].pointBorderWidth = this.pulseRadius > 10 ? 3 : 1;
    }
  }

}