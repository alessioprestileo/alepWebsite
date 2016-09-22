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

  // public static getFromPath(
  //   path: string,
  //   service:WarehouseService) : Promise<WarehouseDep> {
  //     return service.getAll('departments').then(
  //       departments => {
  //         let filtered: WarehouseDepSrc[] = (<WarehouseDepSrc[]>departments)
  //           .filter(dep => {
  //           let result: boolean = false;
  //           if (dep.path === path) {
  //             result = true;
  //           }
  //           return result;
  //         });
  //         return filtered[0];
  //       }
  //     ).then(
  //       depSrc => {
  //         let dep = new WarehouseDep();
  //         return dep.importPropsFromSrc(depSrc, service).then(
  //           () => {
  //             return dep;
  //           }
  //         );
  //       }
  //     );
  // }
	// private getProdsFromSrcProdsIds(
  //   prodsIds: number[],
  //   service: WarehouseService
  // ) : Promise<WarehouseProd[]> {
  //   return service.getAll('products').then(products => {
  //     let result: WarehouseProd[] =[];
  //     let prodsToAdd: WarehouseProdSrc[] =
  //       (<WarehouseProdSrc[]>products).filter(prod => {
  //         let result: boolean = false;
  //         let length: number = prodsIds.length;
  //         for (let i = 0; i < length; i++) {
  //           if (prodsIds[i] === prod.id) {
  //             result = true;
  //           }
  //         }
  //         return result;
  //       });
  //     let length_i: number = prodsIds.length;
  //     let length_j: number = prodsToAdd.length;
  //     for (let i = 0; i < length_i; i++) {
  //       for (let j = 0; j < length_j; j++) {
  //         if (prodsIds[i] === prodsToAdd[j].id) {
  //           let prod: WarehouseProd = new WarehouseProd();
  //           prod.importPropsFromSrc(prodsToAdd[j], service);
  //           result.push(prod);
  //         }
  //       }
  //     }
  //     return result;
  //   });
  // }
  // public importPropsFromSrc(
  //   depSrc: WarehouseDepSrc,
  //   service: WarehouseService
  // ) : Promise<void> {
  //   this.id = depSrc.id;
  //   this.name = depSrc.name;
  //   this.path = depSrc.path;
  //   return this.getProdsFromSrcProdsIds(depSrc.productsIds, service).then(
  //     (prods: WarehouseProd[]) => {
  //       this.products = prods
  //     }
  //   );
  // }

}
