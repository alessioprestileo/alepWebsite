export class DataSetSrc {
  DataPoints: {[label: string] : number};
  Field: string;
  Id: string;
  Ticker: string;

  constructor(
      DataPoints: {[label: string] : number} = {},
      Field: string = null,
      Id: string = null,
      Ticker: string = null) {
    this.DataPoints = DataPoints;
    this.Field = Field;
    this.Id = Id;
    this.Ticker = Ticker;
  }

  public createCopy() : DataSetSrc {
    let copy : DataSetSrc = new DataSetSrc();
    let originalDataPoints: {[label: string] : number} = this.DataPoints;
    for (let label in originalDataPoints) {
      copy.DataPoints[label] = originalDataPoints[label];
    }
    copy.Field = this.Field;
    copy.Id = this.Id;
    copy.Ticker = this.Ticker;
    return copy;
  }
  public reset() : void {
    for (let prop in this) {
      if (typeof this[prop] === 'function') {
        continue;
      }
      else {
        this[prop] = null;
      }
    }
    this.DataPoints = {};
  }
}
