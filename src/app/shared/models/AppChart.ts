import { AppChartCollection } from './AppChartCollection'

export class AppChart {
  public collections: AppChartCollection[];
	public title: string;
  public type: string;

	constructor(type: string = null, title: string = null,
              collections: AppChartCollection[] = []) {
	  this.collections = collections;
		this.title = title;
    this.type = type;
	}

	createCopy() : AppChart {
	  let copy: AppChart = new AppChart();
    let originalCollections: AppChartCollection[] = this.collections;
    let length: number = originalCollections.length;
    for (let i = 0; i < length; i++) {
      copy.collections.push(originalCollections[i].createCopy());
    }
    copy.title = this.title;
    copy.type = this.type;
    return copy;
  }
}
