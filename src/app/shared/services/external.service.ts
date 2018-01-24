import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { DataSetSrc_External } from '../models/DataSetSrc_External';

@Injectable()
export class ExternalService {
  private itemsUrl = 'src/external';  // URL to web api

  constructor(private httpClient: HttpClient) { }

  // Delete dataset source
  public deleteDataSetSrc(dataSetSrc: DataSetSrc_External) : Promise<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let url = `${this.itemsUrl}/${dataSetSrc.Id}`;
    return this.httpClient
      .delete(url, {headers: headers})
      .toPromise()
      .catch(ExternalService.handleError);
  }
  // Get dataset source
  public getDataSetSrc(id: string) : Promise<DataSetSrc_External> {
    return this.getDataSetSrcs()
      .then(dataSetSrc => dataSetSrc.filter(
        dataSetSrc => dataSetSrc.Id === id)[0]);
  }
  // Get all dataset sources
  private getDataSetSrcs() : Promise<DataSetSrc_External[]> {
    return this.httpClient.get(this.itemsUrl)
      .toPromise()
      .then(response => response)
      .catch(ExternalService.handleError);
  }
  // Get filtered dataset sources for which "filterBy" property equals "value"
  public getFilteredDataSetSrcsEquals(
    filterBy: string, value: string
  ) : Promise<DataSetSrc_External[]> {
    return this.getDataSetSrcs().then(
      (dataSetSrcs: DataSetSrc_External[]) : DataSetSrc_External[] => {
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
  ) : Promise<DataSetSrc_External[]> {
    return this.getDataSetSrcs().then(
      (dataSetSrcs: DataSetSrc_External[]) : DataSetSrc_External[] => {
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
    return this.getDataSetSrcs().then((dataSetSrcs: DataSetSrc_External[]) : string[] => {
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
  private post(dataSetSrc: DataSetSrc_External) : Promise<DataSetSrc_External> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient
      .post(this.itemsUrl, dataSetSrc, { headers: headers })
      .toPromise()
      .then(res => res)
      .catch(ExternalService.handleError);
  }
  // Update existing data set source
  private put(dataSetSrc: DataSetSrc_External) : Promise<DataSetSrc_External> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let url = `${this.itemsUrl}/${dataSetSrc.Id}`;
    return this.httpClient
      .put(url, dataSetSrc, { headers: headers })
      .toPromise()
      .then(() => dataSetSrc)
      .catch(ExternalService.handleError);
  }
  // Save data set source
  public saveDataSetSrc(dataSetSrc: DataSetSrc_External) : Promise<DataSetSrc_External> {
    if (dataSetSrc.Id) {
      return this.put(dataSetSrc);
    }
    return this.post(dataSetSrc);
  }
}
