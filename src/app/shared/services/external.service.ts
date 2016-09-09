import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { DataSet } from '../models/DataSet';

@Injectable()
export class ExternalService {
  private itemsUrl = 'src/external';  // URL to web api

  constructor(private http: Http) { }

  // Delete data set
  public deleteDataSet(dataSet: DataSet) : Promise<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let url = `${this.itemsUrl}/${dataSet.Id}`;
    return this.http
      .delete(url, headers)
      .toPromise()
      .catch(ExternalService.handleError);
  }
  // Get data set
  public getDataSet(id: string) : Promise<DataSet> {
    return this.getDataSets()
      .then(dataSet => dataSet.filter(
        dataSet => dataSet.Id === id)[0]);
  }
  // Get all data sets
  private getDataSets() : Promise<DataSet[]> {
    return this.http.get(this.itemsUrl)
      .toPromise()
      .then(response => response.json().data)
      .catch(ExternalService.handleError);
  }
  // Get filtered data sets for which "filterBy" property equals "value"
  public getFilteredDataSetsEquals(
    filterBy: string, value: string
  ) : Promise<DataSet[]> {
    return this.getDataSets().then(
      (dataSets: DataSet[]) : DataSet[] => {
        if (filterBy in dataSets[0]) {
          return dataSets.filter(dataSet => dataSet[filterBy] === value);
        }
        else {
          return null;
        }
      });
  }
  // Get filtered data sets for which "filterBy" property contains "value"
  public getFilteredDataSetsContains(
    filterBy: string, value: string
  ) : Promise<DataSet[]> {
    return this.getDataSets().then(
      (dataSets: DataSet[]) : DataSet[] => {
        if (filterBy in dataSets[0]) {
          return dataSets.filter(dataSet => dataSet[filterBy]
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()));
        }
        else {
          return null;
        }
      });
  }
  public getUniquePropertyValues(propKey: string) : Promise<string[]> {
    return this.getDataSets().then((dataSets: DataSet[]) : string[] => {
      let uniqueValues: string[] = [];
      let length: number = dataSets.length;
      for (let i = 0; i < length; i++) {
        if (uniqueValues.indexOf(dataSets[i][propKey]) === -1) {
          uniqueValues.push(dataSets[i][propKey]);
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
  // Add new data set
  private post(dataSet: DataSet) : Promise<DataSet> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http
      .post(this.itemsUrl, JSON.stringify(dataSet), { headers: headers })
      .toPromise()
      .then(res => res.json().data)
      .catch(ExternalService.handleError);
  }
  // Update existing data set
  private put(dataSet: DataSet) : Promise<DataSet> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let url = `${this.itemsUrl}/${dataSet.Id}`;
    return this.http
      .put(url, JSON.stringify(dataSet), { headers: headers })
      .toPromise()
      .then(() => dataSet)
      .catch(ExternalService.handleError);
  }
  // Save data set
  public saveDataSet(dataSet: DataSet) : Promise<DataSet> {
    if (dataSet.Id) {
      return this.put(dataSet);
    }
    return this.post(dataSet);
  }
}
