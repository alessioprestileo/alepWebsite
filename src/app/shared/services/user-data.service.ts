import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

class Item {
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}

@Injectable()
export class UserDataService {
  private urlsMap: {[collection: string]: string} = {
    'charts': 'src/userData_charts',
    'collections': 'src/userData_collections'
  };

  constructor(private http: Http) { }

  // Delete item from the targeted collection
  public deleteItem(target: string, id: number) : Promise<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let url = `${this.urlsMap[target]}/${id}`;
    return this.http
      .delete(url, headers)
      .toPromise()
      .catch(UserDataService.handleError);
  }
  // Get all items from the targeted collection
  public getAll(target: string) : Promise<Item[]> {
    return this.http.get(this.urlsMap[target]).toPromise().then(
      response => response.json().data
    ).catch(UserDataService.handleError);
  }
  // Get filtered items from the targeted collection
  // for which "filterBy" property equals "value"
  public getFilteredItemsPropEquals(
    target: string, filterBy: string, value: string
  ) : Promise<Item[]> {
    return this.getAll(target).then((items: Item[]) : Item[] => {
      if (filterBy in items[0]) {
        return items.filter(item => item[filterBy] === value);
      }
      else {
        return null;
      }
    });
  }
  // Get filtered items from the targeted collection
  // for which "filterBy" property contains "value"
  public getFilteredItemsPropContains(
    target: string, filterBy: string, value: string
  ) : Promise<Item[]> {
    return this.getAll(target).then(
      (items: Item[]) : Item[] => {
        if (filterBy in items[0]) {
          return items.filter(item => item[filterBy]
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()));
        }
        else {
          return null;
        }
      });
  }
  // Get item from the targeted collection
  public getItem(target: string, id: number) : Promise<Item> {
    return this.getAll(target).then(
      (items: Item[]) => items.filter(item => item.id === id)[0]
    );
  }
  // Get latest id used to onSave an item
  public getLastUsedId(target: string) : Promise<number> {
    return this.getAll(target).then(
      (items: Item[]) => {return items.length}
    );
  }
  // Get all unique values for an item property in the targeted collection
  public getUniquePropValues(target: string, propKey: string) : Promise<string[]> {
    return this.getAll(target).then((items: Item[]) : string[] => {
        let uniqueValues: string[] = [];
        let length: number = items.length;
        for (let i = 0; i < length; i++) {
          if (uniqueValues.indexOf(items[i][propKey]) === -1) {
            uniqueValues.push(items[i][propKey]);
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
  // Add new item to the targeted collection
  private post(target: string, item: Item) : Promise<Item> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http
      .post(this.urlsMap[target], JSON.stringify(item), { headers: headers })
      .toPromise()
      .then(res => res.json().data)
      .catch(UserDataService.handleError);
  }
  // Update existing item
  private put(target: string, item: Item) : Promise<Item> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let url = `${this.urlsMap[target]}/${item.id}`;
    return this.http
      .put(url, JSON.stringify(item), { headers: headers })
      .toPromise()
      .then(() => item)
      .catch(UserDataService.handleError);
  }
  // Save item. If the item is new (id === null),
  // id is assigned by the server
  public saveItem(target: string, item: Item) : Promise<Item> {
    if (item.id) {
      return this.put(target, item);
    }
    return this.post(target, item);
  }
}
