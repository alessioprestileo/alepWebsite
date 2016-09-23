import { WarehouseProd } from "./WarehouseProd";

export class WarehouseDep {
  id: number;
  name: string;
  path: string;
  products: WarehouseProd[];

	constructor(
    id: number = null,
    name: string = null,
    path: string = '',
    products: WarehouseProd[] = []
  ) {
		this.id = id;
    this.name = name;
    this.path = path;
    this.products = products;
	}
}
