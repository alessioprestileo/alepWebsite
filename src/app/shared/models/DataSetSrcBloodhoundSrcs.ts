import { BloodhoundSrc } from './BloodhoundSrc'

export class DataSetSrcBloodhoundSrcs {
  Field: BloodhoundSrc;
  Id: BloodhoundSrc;
  Ticker: BloodhoundSrc;

  constructor(
    Field: BloodhoundSrc = new BloodhoundSrc(null, null),
    Id: BloodhoundSrc = new BloodhoundSrc(null, null),
    Ticker: BloodhoundSrc = new BloodhoundSrc(null, null)
  ) {
    this.Field = Field;
    this.Id = Id;
    this.Ticker = Ticker;
  }
}
