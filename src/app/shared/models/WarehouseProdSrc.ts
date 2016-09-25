import { WarehouseProd } from "./WarehouseProd";

export class WarehouseProdSrc {
  extraFields: {[field: string]: string};
  hierarchy: string[];
  id: number;
  imgSrc: string;
  name: string;
  price: number;
  quantity: number;

  constructor(
    extraFields: {[field: string]: string} = {},
    hierarchy: string[] = [],
    id: number = null,
    imgSrc: string = '',
    name: string = '',
    price: number = 0,
    quantity: number = 0
  ) {
    this.extraFields = extraFields;
    this.hierarchy = hierarchy;
    this.id = id;
    this.imgSrc = imgSrc;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
  // import WarehouseProd props from WarehouseProdSrc
  public importProdSrcPropsFromProd(
    prod: WarehouseProd
  ) : void {
    let originalExtraFields: {[field: string] : any} = prod.extraFields;
    for (let label in originalExtraFields) {
      this.extraFields[label] = originalExtraFields[label];
    }
    for (let path of prod.hierarchy) {
      this.hierarchy.push(path);
    }
    this.id = prod.id;
    this.imgSrc = prod.imgSrc;
    this.name = prod.name;
    this.price = prod.price;
    this.quantity = prod.quantity;
  }
}
