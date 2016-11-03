export class ChartSrc_UserData {
  public collectionsIds: number[];
  public hAxisLabel: string;
  public id: number = null;
  public name: string;
  public subtitle: string;
  public title: string;
  public type: string;
  public vAxisLabel: string;

  constructor(
    name: string = null,
    type: string = null,
    collectionsIds:  number[] = [],
    title: string = null,
    subtitle: string = null,
    hAxisLabel: string = null,
    vAxisLabel: string = null
  ) {
    this.collectionsIds = collectionsIds;
    this.hAxisLabel = hAxisLabel;
    this.name = name;
    this.subtitle = subtitle;
    this.title = title;
    this.type = type;
    this.vAxisLabel = vAxisLabel;
  }
}
