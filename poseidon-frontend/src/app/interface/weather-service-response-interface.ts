export interface WeatherServiceResponse {
    startTime: string;
    windSpeed: string;
    windDirection: string;
    dewpoint: {
        unitCode: string;
        value: number;
    }
    temperature: string;
    shortForecast: string;
    probabilityOfPrecipitation: {
        unitCode: string;
        value: number,
    }
}