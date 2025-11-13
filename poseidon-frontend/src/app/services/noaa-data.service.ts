import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoaaDataService {
  private baseUrl = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';
  private stationId = '8447180'; // Sandwich, MA

  constructor(private http: HttpClient) {}

  getHourlyForecast(): Observable<any> {
  const url = 'https://api.weather.gov/gridpoints/BOX/95,66/forecast/hourly';
  return this.http.get(url);
}

  getTidePredictions(date: String): Observable<any> {
    const url = `${this.baseUrl}?station=${this.stationId}&product=predictions&begin_date=${date}&end_date=${date}&units=english&format=json&time_zone=lst_ldt&datum=MLLW`;
    return this.http.get(url);
  }
}