import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'dictToArray'})
export class DictToArrayPipe implements PipeTransform {
  transform(dict: Object, exponent: string[] = null): Object[] {
    let array: Object[] = [];
    for (let key in dict) {
      array.push({key: key, value: dict[key]});
    }
    return array;
  }
}
