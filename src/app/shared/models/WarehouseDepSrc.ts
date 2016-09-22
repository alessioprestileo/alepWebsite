export class WarehouseDepSrc {
  id: number;
  name: string;
  path: string;
  productsIds: number[];

  constructor(
    id: number = null,
    name: string = null,
    path: string = '',
    productsIds: number[] = []
  ) {
    this.path = path;
    this.id = id;
    this.name = name;
    this.productsIds = productsIds;
  }
}
