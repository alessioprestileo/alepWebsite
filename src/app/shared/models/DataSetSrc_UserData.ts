export class DataSetSrc_UserData {
  public dataPoints: {[label: string] : number};
  public field: string;
  public id: number;
  public ticker: string;

  constructor(
    dataPoints: {[label: string] : number} = {},
    field: string = null,
    id: number = null,
    ticker: string = null
  ) {
    this.dataPoints = dataPoints;
    this.id = id;
    this.field = field;
    this.ticker = ticker;
  }
}
