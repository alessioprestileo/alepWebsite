export class WForecastDay_Astro {
  public sunrise: string;
  public sunset: string;
  public moonrise: string;
  public moonset: string;
}
export class WCondition {
  public text: string;
  public icon: string;
  public code: number;
}
export class WForecastDay_Day {
  public maxtemp_c: number;
  public maxtemp_f: number;
  public mintemp_c: number;
  public mintemp_f: number;
  public avgtemp_c: number;
  public avgtemp_f: number;
  public maxwind_mph: number;
  public maxwind_kph: number;
  public totalprecip_mm: number;
  public totalprecip_in: number;
  public condition: WCondition;
}
export class WForecastDay {
  public date: string;
  public date_epoch: number;
  public day: WForecastDay_Day;
  public astro: WForecastDay_Astro;
  public hour: WHourForecast;
}
export class WHourForecast {
  public time_epoch: number;
  public time: string;
  public temp_c: number;
  public temp_f: number;
  public is_day: number;
  public condition: WCondition;
  public wind_mph: number;
  public wind_kph: number;
  public wind_degree: number;
  public wind_dir: string;
  public pressure_mb: number;
  public pressure_in: number;
  public precip_mm: number;
  public precip_in: number;
  public humidity: number;
  public cloud: number;
  public feelslike_c: number;
  public feelslike_f: number;
  public windchill_c: number;
  public windchill_f: number;
  public heatindex_c: number;
  public heatindex_f: number;
  public dewpoint_c: number;
  public dewpoint_f: number;
  public will_it_rain: number;
  public will_it_snow: number;
}
export class WLocation {
  public name: string;
  public region: string;
  public country: string;
  public lat: number;
  public lon: number;
  public tz_id: string;
  public localtime_epoch: number;
  public localtime: string;
}
export class WForecastSrc {
  public forecastday: WForecastDay[];

}
export class WResponse {
  public location: WLocation;
  public forecast: WForecastSrc;
}
