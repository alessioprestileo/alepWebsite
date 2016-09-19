export class ChartSrc_UserData {
  public collectionsIds: number[];
  public id: number = null;
  public name: string;
  public title: string;
  public type: string;

  constructor(
    name: string = null, type: string = null, title: string = null,
    collectionsIds:  number[] = []
  ) {
    this.collectionsIds = collectionsIds;
    this.name = name;
    this.title = title;
    this.type = type;
  }
}
