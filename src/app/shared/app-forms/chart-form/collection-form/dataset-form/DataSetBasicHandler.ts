import { BHSrcsDataSetSrc_External } from "../../../../models/BHSrcsDataSetSrc_External";
import { DataSetSrc_External } from "../../../../models/DataSetSrc_External";
import { DataSetFeedback } from "../../../../models/DataSetFeedback";
import { ExternalService } from '../../../../services/external.service';

export class DataSetBasicHandler {
  protected dataSetSrcBloodhoundSrcs: BHSrcsDataSetSrc_External;

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
  ) : Promise<DataSetSrc_External> {
    return this.externalService.getFilteredDataSetSrcsEquals(
      'Ticker', tickerValue
    ).then(
      (dataSetSrcs: DataSetSrc_External[]) : DataSetSrc_External => {
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
        return this.externalService.getUniquePropertyValues('field').then(
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
      (dataSetSrcs: DataSetSrc_External[]) : void => {
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
