import { ChartColl } from './ChartColl'
import { ChartCollSrc_UserData } from "./ChartCollSrc_UserData";
import { ChartSrc_UserData } from "./ChartSrc_UserData";
import { UserDataService } from "../services/user-data.service";

export class Chart {
  public collections: ChartColl[];
  public id: number = null;
  public name: string;
  public title: string;
  public type: string;

	constructor(
	  name: string = null, type: string = null, title: string = null,
    collections: ChartColl[] = []
  ) {
	  this.collections = collections;
    this.name = name;
		this.title = title;
    this.type = type;
	}

	public createCopy() : Chart {
	  let copy: Chart = new Chart();
    let originalCollections: ChartColl[] = this.collections;
    let length: number = originalCollections.length;
    for (let i = 0; i < length; i++) {
      copy.collections.push(originalCollections[i].createCopy());
    }
    copy.name = this.name;
    copy.title = this.title;
    copy.type = this.type;
    return copy;
  }
  public importPropsFromSrc_UserData(
    src: ChartSrc_UserData,
    service: UserDataService
  ) : Promise<void> {
    this.id = src.id;
    this.name = src.name;
    this.title = src.title;
    this.type = src.type;
    return service.getAll('collections').then(collections => {
      let collsToAdd: ChartCollSrc_UserData[] =
        <ChartCollSrc_UserData[]>collections.filter(coll => {
        let result: boolean = false;
        let ids: number[] = src.collectionsIds;
        let length: number = ids.length;
        for (let i = 0; i < length; i++) {
          if (coll.id === ids[i]) {
            result = true;
          }
        }
        return result;
      });
      let lengthToAdd: number = collsToAdd.length;
      for (let i = 0; i < lengthToAdd; i++) {
        let coll: ChartColl = new ChartColl();
        this.collections.push(coll);
        coll.importPropsFromSrc_UserData(collsToAdd[i]);
      }
    });
  }
  public toChartSrc_UserData() : ChartSrc_UserData {
    let src: ChartSrc_UserData = new ChartSrc_UserData();
    let collections: ChartColl[] = this.collections;
    let length: number = collections.length;
    for (let i = 0; i < length; i++) {
      src.collectionsIds.push(collections[i].id);
    }
    src.id = this.id;
    src.name = this.name;
    src.title = this.title;
    src.type = this.type;
    return src;
  }
}
