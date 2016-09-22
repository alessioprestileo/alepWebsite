export class WarehouseProdSrc {
  extraFields: {[field: string]: any};
  hierarchy: number[][];
  id: number;
  imgSrc: string;
  name: string;
  price: number;
  quantity: number;

  constructor(
    extraFields: {[field: string]: any} = {},
    hierarchy: number[][] = [],
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
}
