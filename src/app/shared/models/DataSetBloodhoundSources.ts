import { BloodhoundSource } from './BloodhoundSource'

export class DataSetBloodhoundSources {
  Field: BloodhoundSource;
  Id: BloodhoundSource;
  Ticker: BloodhoundSource;

  constructor(Field: BloodhoundSource, Id: BloodhoundSource, Ticker: BloodhoundSource) {
    this.Field = Field;
    this.Id = Id;
    this.Ticker = Ticker;
  }
}
