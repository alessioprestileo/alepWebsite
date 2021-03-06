import { ChartCollSrc_UserData } from "./ChartCollSrc_UserData";
import { DataSet } from './DataSet'
import { DataSetSrc_UserData } from './DataSetSrc_UserData'

export class ChartColl {
  public dataSet: DataSet;
  public id: number = null;
  public label: string;
	public name: string;

	constructor(
	  name: string = null,
    label: string = null,
    dataSet: DataSet = new DataSet()
  ) {
		this.name = name;
    this.label = label;
    this.dataSet = dataSet;
	}

	public createCopy() : ChartColl {
	  let copy: ChartColl = new ChartColl();
    copy.dataSet = this.dataSet.createCopy();
    copy.label = this.label;
    copy.name = this.name;
    return copy;
  }
  public importPropsFromSrc_UserData(
    collectionSrc: ChartCollSrc_UserData
  ) : void {
    this.dataSet.importPropsFromUserDataSrc_UserData(
      <DataSetSrc_UserData>collectionSrc.dataSet
    );
    this.id = collectionSrc.id;
    this.label = collectionSrc.label;
    this.name = collectionSrc.name;
  }
}
