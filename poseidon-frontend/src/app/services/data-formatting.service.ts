import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DataFormattingService {
  public convertMphToKnots(speed: number): number {
    return +(speed / 1.15078).toFixed(2);
  }

  public convertKnotsToMph(speed: number): number {
    return +(speed * 1.15078).toFixed(2);
  }

  public convertToReadableHour(isoString: string): string {
    const date = new Date(isoString);
    const readableHour = date.toLocaleString('en-US', { hour: 'numeric', hour12: true });
    return readableHour;
  }

  public convertCelsiusToFahrenheit(value: number): number {
    return (value * 9/5) + 32;
  }
}
