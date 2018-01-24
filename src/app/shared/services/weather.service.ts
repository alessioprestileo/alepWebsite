import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { WResponse } from "../models/weather-forecast-src-classes";

@Injectable()
export class WeatherService {
  private url: string = 'src/weather';

  constructor(private httpClient: HttpClient) { }

  // Get all forecast objects from json file (data includes only one week:
  // 2016-09-12 to 2016-09-18)
  public getAll() : Promise<WResponse[]> {
    return this.httpClient.get(this.url).toPromise().then(
      response => response
    ).catch(WeatherService.handleError);
  }
  // Get value corresponding to the given property for every day in the week
  public getWeekData(prop: string) : Promise<{[label: string]: number}> {
    return this.getAll().then(
      (responses: WResponse[]) => {
        let dataPoints: {[label: string]: number} = {};
        let length: number = responses.length;
        for (let i = 0; i < length; i++) {
          let date: string = responses[i].forecast.forecastday[0].date;
          let value: number = responses[i].forecast.forecastday[0].day[prop];
          dataPoints[date] = value;
        }
        return dataPoints;
      }
    );
  }
  // Get all the props that can be queried within a week's forecast
  public getWeekProps() : Promise<string[]> {
    return this.getAll().then(
      (responses: WResponse[]) => {
        let result: string[] = [];
        let dailyForecast: any = responses[0].forecast.forecastday[0].day;
        for (let prop in dailyForecast) {
          if (typeof dailyForecast[prop] === 'number') {
            result.push(prop);
          }
        }
        return result;
      }
    );
  }
  // Handle error
  private static handleError(error: any) : Promise<any> {
    alert('An error occurred with the server:\n' + error.status +
      ', ' + error.statusText);
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
