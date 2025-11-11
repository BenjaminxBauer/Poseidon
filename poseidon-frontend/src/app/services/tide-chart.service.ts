import { Injectable } from '@angular/core';
import {
  ChartConfiguration,
  ChartDataset,
} from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class TideChartService {
  private pulseRadius = 10;
  private pulseGrowing = true;

  getChartConfig(labels: string[], data: number[]): ChartConfiguration<'line'> {
    return {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Tide Level (ft)',
            data,
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
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Time' },
            ticks: { 
              callback: (value: string | number, index: number) => {
                const label = typeof value === 'string' ? value : labels[index];
                const date = new Date(label);
                const minutes = date.getMinutes();
                return (minutes === 0)
                  ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '';
              },
              autoSkip: false
            },
            grid: { display: false }
          },
          y: {
            title: { display: true, text: 'Water Level (ft)' },
            ticks: { display: false },
            grid: { display: false },
            beginAtZero: false
          }
        }
      }
    };
  }

  getInitialChartConfig(labels: string[], data: number[]): ChartConfiguration<'line'> {
    return {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Tide Level (ft)',
            data,
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
            title: { display: true, text: 'Time' },
            ticks: { 
              callback: (value: string | number, index: number) => {
                const label = typeof value === 'string' ? value : labels[index];
                const date = new Date(label);
                const minutes = date.getMinutes();
                return (minutes === 0)
                  ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '';
              },
              autoSkip: false
             },
            grid: { display: false }
          },
          y: {
            title: { display: true, text: 'Water Level (ft)' },
            ticks: { display: false },
            grid: { display: false },
            beginAtZero: false
          }
        }
      }
    };
  }

  updateFlashingPoint(
    config: ChartConfiguration<'line'>,
    labels: string[],
    data: number[]
  ): void {
    const now = new Date();
    const currentIndex = labels.findIndex(label => {
      const labelTime = new Date(label);
      return Math.abs(labelTime.getTime() - now.getTime()) < 5 * 60 * 1000;
    });

    if (currentIndex !== -1) {
      const flashingData = new Array(labels.length).fill(null);
      flashingData[currentIndex] = data[currentIndex];

      const flashingDataset = config.data.datasets[1] as ChartDataset<'line'>;
      flashingDataset.data = flashingData;

      if (this.pulseGrowing) {
        this.pulseRadius += 2;
        if (this.pulseRadius >= 14) this.pulseGrowing = false;
      } else {
        this.pulseRadius -= 2;
        if (this.pulseRadius <= 6) this.pulseGrowing = true;
      }

      flashingDataset.pointRadius = this.pulseRadius;
      flashingDataset.pointBorderWidth = this.pulseRadius > 10 ? 3 : 1;
    }
  }

}
