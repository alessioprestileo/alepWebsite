import { AppChartCollection } from './AppChartCollection'

export class AppChart {
  public collections: AppChartCollection[];
  public id: number = null;
  public name: string;
  public title: string;
  public type: string;

	constructor(
	  name: string = null, type: string = null, title: string = null,
    collections: AppChartCollection[] = []
  ) {
	  this.collections = collections;
    this.name = name;
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
    copy.name = this.name;
    copy.title = this.title;
    copy.type = this.type;
    return copy;
  }
}
