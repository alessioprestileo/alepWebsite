import { ChartBody } from "./ChartBody";
import { ChartBodyOrthogonal } from "./ChartBodyOrthogonal";
import { PlotArea } from "./PlotArea";

export abstract class PlotAreaOrthogonal extends PlotArea {
  protected aspectRatio: number;
  protected parentChartBody: ChartBodyOrthogonal;

  constructor(parentChartBody: ChartBody) {
    super();
    this.parentChartBody = (<ChartBodyOrthogonal>parentChartBody);
    this.d3ScaleColorPalette = this.createD3ScaleColorPalette(
      this.getD3ScaleColorPaletteDomainLength(),
      this.getD3ScaleColorPaletteRange()
    );
    this.setDimensions();
    this.setPosition();
    this.d3Selection = this.createD3Selection();
  }
  /* Private methods */
  private getD3ScaleColorPaletteDomainLength() : number {
    return this.parentChartBody.getCollections().length;
  }
  private getD3ScaleColorPaletteRange() : string[] {
    let range: string[] = this.parentChartBody
      .getParentVisualization()
      .getParentCanvas()
      .getParentChart()
      .getStyling()
      .chartBody.plotArea.paletteRange[0];
    return range;
  }
  private setAspectRatio() : void {
    this.aspectRatio = this.parentChartBody
      .getParentVisualization()
      .getParentCanvas()
      .getParentChart()
      .getStyling()
      .chartBody
      .plotArea
      .aspectRatio[0];
  }
  /* Protected methods */
  protected setDimensions() : void {
    this.setAspectRatio();
    this.setWidth();
    this.setHeight();
  }
  protected setHeight() : void {
    this.height = this.width / this.aspectRatio;
  }
  protected setWidth() : void {
    let chartBodyWidth: number = this.parentChartBody.getWidth();
    let valuesAxisGroupWidth: number = this.parentChartBody
      .getValuesAxisLeft()
      .getXPos();
    let width: number = chartBodyWidth - valuesAxisGroupWidth;
    this.width = width;
  }
  protected setXPos() : void {
    this.xPos = 0;
  }
  protected setYPos() : void {
    this.yPos = 0;
  }
  /* Public methods */
  public abstract drawData() : void;
  public getXPos() : number {
    return this.xPos;
  }
  public getYPos() : number {
    return this.yPos;
  }
}
