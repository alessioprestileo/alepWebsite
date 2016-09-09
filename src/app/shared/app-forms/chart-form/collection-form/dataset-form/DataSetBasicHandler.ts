import { DataSet } from "../../../../models/DataSet";
import { DataSetFeedback } from "../../../../models/DataSetFeedback";
import { DataSetBloodhoundSources } from "../../../../models/DataSetBloodhoundSources";
import { ExternalService } from '../../../../services/external.service';

export class DataSetBasicHandler {
  protected dataSetBloodhoundSources: DataSetBloodhoundSources;

  constructor(protected externalService: ExternalService) {}

  protected dataSetFeedbackWasReset(feedback : DataSetFeedback) : boolean {
    if (feedback.prop === 'reset') {
      return true;
    }
    else {
      return false;
    }
  }
  protected getDataSetFromTickerField(
    tickerValue: string, fieldValue: string
  ) : Promise<DataSet> {
    return this.externalService.getFilteredDataSetsEquals(
      'Ticker', tickerValue
    ).then(
      (dataSets: DataSet[]) : DataSet => {
        return dataSets.filter(dataSet => dataSet.Field === fieldValue)[0];
      }
    );
  }
  protected setDefaultDataSetBloodhoundSources() : Promise<void> {
    return this.externalService.getUniquePropertyValues('Ticker').then(
      (uniqueTickers: string[]) : Promise<void> => {
        this.dataSetBloodhoundSources.Ticker.defaultSource = uniqueTickers;
        return this.externalService.getUniquePropertyValues('Field').then(
          (uniqueFields: string[]) : Promise<void> => {
            this.dataSetBloodhoundSources.Field.defaultSource = uniqueFields;
            return this.externalService.getUniquePropertyValues('Id').then(
              (uniqueIds: string[]) => {
                this.dataSetBloodhoundSources.Id.defaultSource = uniqueIds;
              }
            );
          }
        );
      }
    );
  }
  protected resetFilteredDataSetBloodhoundSource() : void {
    this.dataSetBloodhoundSources.Field.filteredSource = null;
    this.dataSetBloodhoundSources.Id.filteredSource = null;
    this.dataSetBloodhoundSources.Ticker.filteredSource = null;
  }
  protected setFilteredDataSetBloodhoundSource(
    target: string, filterName: string, filterValue: string
  ) : void {
    this.externalService.getFilteredDataSetsEquals(filterName, filterValue).then(
      (dataSets: DataSet[]) : void => {
        this.dataSetBloodhoundSources[target].filteredSource = [];
        let length: number = dataSets.length;
        for (let i = 0; i < length; i++) {
          this.dataSetBloodhoundSources[target].filteredSource.push(dataSets[i][target]);
        }
      }
    );
  }
}
