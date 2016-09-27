import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { WarehouseDep } from "../models/WarehouseDep";
import { WarehouseDepSrc } from "../models/WarehouseDepSrc";
import { WarehouseProd } from "../models/WarehouseProd";
import { WarehouseProdSrc } from "../models/WarehouseProdSrc";

class Item {
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}

@Injectable()
export class WarehouseService {
  private urlsMap: {[collection: string]: string} = {
    'departments': 'src/warehouse_departments',
    'products': 'src/warehouse_products'
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
      .catch(WarehouseService.handleError);
  }
  // Get all items from the targeted collection
  public getAll(target: string) : Promise<Item[]> {
    return this.http.get(this.urlsMap[target]).toPromise().then(
      response => response.json().data
    ).catch(WarehouseService.handleError);
  }
  // Get WarehouseDep from path
  public getDepFromPath(path: string) : Promise<WarehouseDep> {
    return this.getAll('departments').then(
      departments => {
        let filtered: WarehouseDepSrc[] = (<WarehouseDepSrc[]>departments)
          .filter(dep => {
            let result: boolean = false;
            if (dep.path === path) {
              result = true;
            }
            return result;
          });
        return filtered[0];
      }
    ).then(
      depSrc => {
        return this.getDepFromSource(depSrc);
      });
  }
  // Get WarehouseDep from WarehouseDepSrc
  public getDepFromSource(depSrc: WarehouseDepSrc) : Promise<WarehouseDep> {
    let dep: WarehouseDep = new WarehouseDep;
    dep.id = depSrc.id;
    dep.name = depSrc.name;
    dep.path = depSrc.path;
    return this.getDepProdsFromDepSrcProdsIds(depSrc.productsIds).then(
      (prods: WarehouseProd[]) => {
        dep.products = prods;
        return dep;
      }
    );
  }
  // Get WarehouseDep.products from WarehouseDepSrc.productsIds
  public getDepProdsFromDepSrcProdsIds(
    prodsIds: number[]
  ) : Promise<WarehouseProd[]> {
    return this.getAll('products').then(products => {
      let result: WarehouseProd[] =[];
      let filteredProdSrcs: WarehouseProdSrc[] =
        (<WarehouseProdSrc[]>products).filter(prod => {
          let result: boolean = false;
          let length: number = prodsIds.length;
          for (let i = 0; i < length; i++) {
            if (prodsIds[i] === prod.id) {
              result = true;
            }
          }
          return result;
        });
      let length_i: number = prodsIds.length;
      let length_j: number = filteredProdSrcs.length;
      for (let i = 0; i < length_i; i++) {
        for (let j = 0; j < length_j; j++) {
          if (prodsIds[i] === filteredProdSrcs[j].id) {
            let prod: WarehouseProd = new WarehouseProd();
            result.push(prod);
            prod.importProdPropsFromProdSrc(filteredProdSrcs[j]);
          }
        }
      }
      return result;
    });
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
  // Get latest id used to save an item
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
      .catch(WarehouseService.handleError);
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
      .catch(WarehouseService.handleError);
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
