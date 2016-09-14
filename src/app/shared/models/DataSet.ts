export class DataSet {
  DataPoints: {[label: string] : number};
  Field: string;
  Ticker: string;

  constructor(
    DataPoints: {[label: string] : number} = {},
    Field: string = null,
    Ticker: string = null
  ) {
    this.DataPoints = DataPoints;
    this.Field = Field;
    this.Ticker = Ticker;
  }

  public createCopy() : DataSet {
    let copy : DataSet = new DataSet();
    let originalDataPoints: {[label: string] : number} = this.DataPoints;
    for (let label in originalDataPoints) {
      copy.DataPoints[label] = originalDataPoints[label];
    }
    copy.Field = this.Field;
    copy.Ticker = this.Ticker;
    return copy;
  }
  // public resetProps() : void {
  //   for (let prop in this) {
  //     if (typeof this[prop] === 'function') {
  //       continue;
  //     }
  //     else {
  //       this[prop] = null;
  //     }
  //   }
  //   this.DataPoints = {};
  // }
}
