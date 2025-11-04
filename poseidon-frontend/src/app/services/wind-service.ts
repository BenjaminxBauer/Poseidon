import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WindService {
  public convertMphToKnots(speed: number): number {
    return +(speed / 1.15078).toFixed(2);
  }

  public convertKnotsToMph(speed: number): number {
    return +(speed * 1.15078).toFixed(2);
  }
}
