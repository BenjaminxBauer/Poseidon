import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoaaDataService {
  private baseUrl = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';

  constructor(private http: HttpClient) {}

  getHourlyForecast(): Observable<any> {
  const url = 'https://api.weather.gov/gridpoints/BOX/95,66/forecast/hourly';
  return this.http.get(url);
}

  getTidePredictions(station: string): Observable<any> {
    const url = `${this.baseUrl}?station=${station}&product=predictions&date=today&units=english&format=json&time_zone=lst_ldt&datum=MLLW`;
    return this.http.get(url);
  }
}