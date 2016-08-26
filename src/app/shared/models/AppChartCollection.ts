import { DataSet } from './DataSet'

export class AppChartCollection {
  public dataSet: DataSet;
	public name: string;

	constructor(name: string = null, dataSet: DataSet = new DataSet()) {
		this.name = name;
    this.dataSet = dataSet;
	}

	createCopy() : AppChartCollection {
	  let copy: AppChartCollection = new AppChartCollection();
    copy.dataSet = this.dataSet.createCopy();
    copy.name = this.name;
    return copy;
  }
}
