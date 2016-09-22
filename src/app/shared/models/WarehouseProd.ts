import { WarehouseDepSrc } from "./WarehouseDepSrc";
import { WarehouseProdSrc } from "./warehouseProdSrc";
import { WarehouseService } from "../services/warehouse.service";

export class WarehouseProd {
	extraFields: {[field: string]: any};
  hierarchy: string[][];
	id: number;
  imgSrc: string;
  name: string;
  price: number;
  quantity: number;

  constructor(
    extraFields: {[field: string]: any} = {},
    hierarchy: string[][] = [],
    id: number = null,
    imgSrc: string = null,
    name: string = null,
    price: number = null,
    quantity: number = null
  ) {
    this.extraFields = extraFields;
    this.hierarchy = hierarchy;
    this.id = id;
    this.imgSrc = imgSrc;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
	}

  // public importPropsFromSrc(
  //   prodSrc: WarehouseProdSrc,
  //   service: WarehouseService
  // ) : Promise<void> {
  //   let originalExtraFields: {[field: string] : any} = prodSrc.extraFields;
  //   for (let label in originalExtraFields) {
  //     this.extraFields[label] = originalExtraFields[label];
  //   }
  //   this.id = prodSrc.id;
  //   this.imgSrc = prodSrc.imgSrc;
  //   this.name = prodSrc.name;
  //   this.price = prodSrc.price;
  //   this.quantity = prodSrc.quantity;
  //   return service.getAll('departments').then(departments => {
  //     let depsToAdd: WarehouseDepSrc[] =
  //       (<WarehouseDepSrc[]>departments).filter(dep => {
  //         let result: boolean = false;
  //         let hierarchy: number[][] = prodSrc.hierarchy;
  //         let length_1: number = hierarchy.length;
  //         for (let i = 0; i < length_1; i++) {
  //           let length_2: number = hierarchy[i].length;
  //           for (let j = 0; j < length_2; j++) {
  //             if (hierarchy[i][j] === dep.id) {
  //               result = true;
  //             }
  //           }
  //         }
  //         return result;
  //       });
  //     let hierarchy: number[][] = prodSrc.hierarchy;
  //     let length_k: number = depsToAdd.length;
  //     let length_i: number = hierarchy.length;
  //     for (let i = 0; i < length_i; i++) {
  //       let length_j: number = hierarchy[i].length;
  //       for (let j = 0; j < length_j; j++) {
  //         this.hierarchy.push([]);
  //         for (let k = 0; k < length_k; k++) {
  //           if (depsToAdd[k].id === hierarchy[i][j]) {
  //             this.hierarchy[this.hierarchy.length - 1].push(depsToAdd[k].name);
  //           }
  //         }
  //       }
  //     }
  //   });
  // }
}
