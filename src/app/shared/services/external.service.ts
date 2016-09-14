import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { DataSetSrc } from '../models/DataSetSrc';

@Injectable()
export class ExternalService {
  private itemsUrl = 'src/external';  // URL to web api

  constructor(private http: Http) { }

  // Delete dataset source
  public deleteDataSetSrc(dataSetSrc: DataSetSrc) : Promise<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let url = `${this.itemsUrl}/${dataSetSrc.Id}`;
    return this.http
      .delete(url, headers)
      .toPromise()
      .catch(ExternalService.handleError);
  }
  // Get dataset source
  public getDataSetSrc(id: string) : Promise<DataSetSrc> {
    return this.getDataSetSrcs()
      .then(dataSetSrc => dataSetSrc.filter(
        dataSetSrc => dataSetSrc.Id === id)[0]);
  }
  // Get all dataset sources
  private getDataSetSrcs() : Promise<DataSetSrc[]> {
    return this.http.get(this.itemsUrl)
      .toPromise()
      .then(response => response.json().data)
      .catch(ExternalService.handleError);
  }
  // Get filtered dataset sources for which "filterBy" property equals "value"
  public getFilteredDataSetSrcsEquals(
    filterBy: string, value: string
  ) : Promise<DataSetSrc[]> {
    return this.getDataSetSrcs().then(
      (dataSetSrcs: DataSetSrc[]) : DataSetSrc[] => {
        if (filterBy in dataSetSrcs[0]) {
          return dataSetSrcs.filter(
            dataSetSrc => dataSetSrc[filterBy] === value
          );
        }
        else {
          return null;
        }
      });
  }
  // Get filtered dataset sources for which "filterBy" property contains "value"
  public getFilteredDataSetSrcsContains(
    filterBy: string, value: string
  ) : Promise<DataSetSrc[]> {
    return this.getDataSetSrcs().then(
      (dataSetSrcs: DataSetSrc[]) : DataSetSrc[] => {
        if (filterBy in dataSetSrcs[0]) {
          return dataSetSrcs.filter(dataSetSrc => dataSetSrc[filterBy]
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()));
        }
        else {
          return null;
        }
      });
  }
  public getUniquePropertyValues(propKey: string) : Promise<string[]> {
    return this.getDataSetSrcs().then((dataSetSrcs: DataSetSrc[]) : string[] => {
      let uniqueValues: string[] = [];
      let length: number = dataSetSrcs.length;
      for (let i = 0; i < length; i++) {
        if (uniqueValues.indexOf(dataSetSrcs[i][propKey]) === -1) {
          uniqueValues.push(dataSetSrcs[i][propKey]);
        }
      }
      return uniqueValues;
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
  // Add new data set source
  private post(dataSetSrc: DataSetSrc) : Promise<DataSetSrc> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http
      .post(this.itemsUrl, JSON.stringify(dataSetSrc), { headers: headers })
      .toPromise()
      .then(res => res.json().data)
      .catch(ExternalService.handleError);
  }
  // Update existing data set source
  private put(dataSetSrc: DataSetSrc) : Promise<DataSetSrc> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let url = `${this.itemsUrl}/${dataSetSrc.Id}`;
    return this.http
      .put(url, JSON.stringify(dataSetSrc), { headers: headers })
      .toPromise()
      .then(() => dataSetSrc)
      .catch(ExternalService.handleError);
  }
  // Save data set source
  public saveDataSetSrc(dataSetSrc: DataSetSrc) : Promise<DataSetSrc> {
    if (dataSetSrc.Id) {
      return this.put(dataSetSrc);
    }
    return this.post(dataSetSrc);
  }
}
