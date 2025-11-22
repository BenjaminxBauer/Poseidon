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
import { TideChartService } from '../services/tide-chart.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { Station } from '../interface/station-interface';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, BaseChartDirective, MatGridListModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})

export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  tideChartConfig: any;
  tideTime: string[] = [];
  tideHeight: number[] = [];
  stations: Station[] = [
    {value: '8447180', viewValue: 'Sandwich'},
    {value: '8447930', viewValue: 'Woods Hole'},
    {value: '8447435', viewValue: 'Chatham'},
    {value: '8443970', viewValue: 'Boston'}
  ];
  selectedStation = this.stations[0].value;

  constructor(
    private tideChartService: TideChartService,
  ) {}

  ngOnInit(): void {
    this.tideChartService.loadChartForStation(this.selectedStation).subscribe(config => {
      this.tideChartConfig = config;
    });
  }

  loadChart(stationId: string): void {
    this.tideChartService.loadChartForStation(stationId).subscribe(config => {
      this.tideChartConfig = config;
    });
  }

}