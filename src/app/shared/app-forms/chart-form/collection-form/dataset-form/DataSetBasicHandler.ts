import { DataSetSrc } from "../../../../models/DataSetSrc";
import { DataSetFeedback } from "../../../../models/DataSetFeedback";
import { DataSetSrcBloodhoundSrcs } from "../../../../models/DataSetSrcBloodhoundSrcs";
import { ExternalService } from '../../../../services/external.service';

export class DataSetBasicHandler {
  protected dataSetSrcBloodhoundSrcs: DataSetSrcBloodhoundSrcs;

  constructor(protected externalService: ExternalService) {
  }

  protected dataSetFeedbackWasReset(feedback : DataSetFeedback) : boolean {
    if (feedback.prop === 'resetProps') {
      return true;
    }
    else {
      return false;
    }
  }
  protected getDataSetSrcFromTickerField(
    tickerValue: string, fieldValue: string
  ) : Promise<DataSetSrc> {
    return this.externalService.getFilteredDataSetSrcsEquals(
      'Ticker', tickerValue
    ).then(
      (dataSetSrcs: DataSetSrc[]) : DataSetSrc => {
        return dataSetSrcs.filter(
          dataSetSrc => dataSetSrc.Field === fieldValue
        )[0];
      }
    );
  }
  protected setDefaultDataSetSrcBloodhoundSrcs() : Promise<void> {
    return this.externalService.getUniquePropertyValues('Ticker').then(
      (uniqueTickers: string[]) : Promise<void> => {
        this.dataSetSrcBloodhoundSrcs.Ticker.defaultSource = uniqueTickers;
        return this.externalService.getUniquePropertyValues('Field').then(
          (uniqueFields: string[]) : Promise<void> => {
            this.dataSetSrcBloodhoundSrcs.Field.defaultSource = uniqueFields;
            return this.externalService.getUniquePropertyValues('Id').then(
              (uniqueIds: string[]) => {
                this.dataSetSrcBloodhoundSrcs.Id.defaultSource = uniqueIds;
              }
            );
          }
        );
      }
    );
  }
  protected resetDataSetSrcBloodhoundSrc() : void {
    this.dataSetSrcBloodhoundSrcs.Field.filteredSource = null;
    this.dataSetSrcBloodhoundSrcs.Id.filteredSource = null;
    this.dataSetSrcBloodhoundSrcs.Ticker.filteredSource = null;
  }
  protected setFilteredDataSetSrcBloodhoundSrc(
    target: string, filterName: string, filterValue: string
  ) : void {
    this.externalService.getFilteredDataSetSrcsEquals(
      filterName, filterValue
    ).then(
      (dataSetSrcs: DataSetSrc[]) : void => {
        this.dataSetSrcBloodhoundSrcs[target].filteredSource = [];
        let length: number = dataSetSrcs.length;
        for (let i = 0; i < length; i++) {
          this.dataSetSrcBloodhoundSrcs[target].filteredSource.push(
            dataSetSrcs[i][target]
          );
        }
      }
    );
  }
}
