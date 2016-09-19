import { BHSrc } from './BHSrc'

export class BHSrcsDataSetSrc_External {
  Field: BHSrc;
  Id: BHSrc;
  Ticker: BHSrc;

  constructor(
    Field: BHSrc = new BHSrc(null, null),
    Id: BHSrc = new BHSrc(null, null),
    Ticker: BHSrc = new BHSrc(null, null)
  ) {
    this.Field = Field;
    this.Id = Id;
    this.Ticker = Ticker;
  }
}
