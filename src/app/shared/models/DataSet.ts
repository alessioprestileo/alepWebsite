import { appIsEmptyObject } from '../appFunctions'
import { DataSetSrc_UserData } from './DataSetSrc_UserData'

export class DataSet {
  public dataPoints: {[label: string] : number};
  public field: string;
  public ticker: string;

  constructor(
    dataPoints: {[label: string] : number} = {},
    field: string = null,
    ticker: string = null
  ) {
    this.dataPoints = dataPoints;
    this.field = field;
    this.ticker = ticker;
  }

  public createCopy() : DataSet {
    let copy : DataSet = new DataSet();
    let originalDataPoints: {[label: string] : number} = this.dataPoints;
    for (let label in originalDataPoints) {
      copy.dataPoints[label] = originalDataPoints[label];
    }
    copy.field = this.field;
    copy.ticker = this.ticker;
    return copy;
  }
  public isEmpty() : boolean {
    let result: boolean;
    if (
      appIsEmptyObject(this.dataPoints) &&
      this.field === null &&
      this.ticker === null
    ) {
      result = true;
    }
    else {
      result = false;
    }
    return result;
  }
  public importPropsFromUserDataSrc_UserData(
    dataSetSrc: DataSetSrc_UserData
  ) : void {
    let originalDataPoints: {[label: string] : number} = dataSetSrc.dataPoints;
    for (let label in originalDataPoints) {
      this.dataPoints[label] = originalDataPoints[label];
    }
    this.field = dataSetSrc.field;
    this.ticker = dataSetSrc.ticker;
  }
  public resetProps() : void {
    for (let prop in this) {
      if (typeof this[prop] === 'function') {
        continue;
      }
      else {
        this[prop] = null;
      }
    }
    this.dataPoints = {};
  }
}
