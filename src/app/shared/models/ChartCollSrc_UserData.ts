import { DataSetSrc_UserData } from "./DataSetSrc_UserData";

export class ChartCollSrc_UserData {
  public dataSet: DataSetSrc_UserData;
  public id: number = null;
  public name: string;

  constructor(
    name: string = null,
    dataSet: DataSetSrc_UserData = new DataSetSrc_UserData()
  ) {
    this.name = name;
    this.dataSet = dataSet;
  }
}
