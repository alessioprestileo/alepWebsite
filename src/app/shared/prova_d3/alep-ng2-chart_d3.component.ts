import {
  Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy,
  OnInit, ViewChild
} from '@angular/core';

import { Subscription } from 'rxjs/Rx';

// import { iAlepNg2InputChart } from '../../models/iAlepNg2InputChart'
import { iAlepNg2InputChart } from './iAlepNg2InputChart';
import {iAlepNg2InputChartColl} from "./iAlepNg2InputChartColl";
import { iStylingChart } from './iChartStyling';
import {Chart} from "../models/Chart";

declare var d3: any;

class Chart {
  private canvas: Canvas;
  private d3SelectionParentContainer: any;
  private d3SelectionBackground: any;
  private inputChart: iAlepNg2InputChart;
  private styling: iStylingChart;
  private subtitle: Subtitle;
  private title: Title;
  private visualization: Visualization;

  constructor(
    d3SelectionParentContainer: any,
    inputChart: iAlepNg2InputChart,
    styling: iStylingChart
  ) {
    this.d3SelectionParentContainer = d3SelectionParentContainer;
    this.inputChart = inputChart;
    this.styling = styling;
    this.canvas = new Canvas(this);
    this.d3SelectionBackground = this.createD3SelectionBackground();
    this.title = new Title(this.canvas);
    this.subtitle = new Subtitle(this.canvas);
    this.visualization = new Visualization(this.canvas);
  }
  /* Private methods */
  private adjustHeight() : void {
    let chartBodyHeight: number = this.visualization.ch
    let titleHeight: number = this.title.d3Selection.getBBox().height;
    let subtitleHeight: number = this.subtitle.d3Selection.getBBox().height;
    let styling: iStylingChart = this.styling;

    let height: number =
      styling.title.marginTop +

    canvasSelection.style('height', canvasHeight);
    backgroundSelection.style('height', canvasHeight);
  }
  private createD3SelectionBackground() : any {
    let parentCanvas: any = this.canvas;
    let styling: iStylingChart = this.styling;

    let d3SelectionBackground: any = parentCanvas.d3Selection
      .append('rect')
      .attr('class', 'background')
      .style('fill', styling.backgroundColor[0])
      .style('width', parentCanvas.getWidth());
    return d3SelectionBackground;
  }
  /* Public methods */
  public getCanvas() : Canvas {
    return this.canvas;
  }
  public getD3SelectionParentContainer() : any {
    return this.d3SelectionParentContainer;
  }
  public getD3SelectionBackground() : any {
    return this.d3SelectionBackground;
  }
  public getInputChart() : iAlepNg2InputChart {
    return this.inputChart;
  }
  public getStyling() : iStylingChart {
    return this.styling;
  }
  public getSubtitle() : Subtitle {
    return this.subtitle;
  }
  public getTitle() : Title {
    return this.title;
  }
  public getVisualization() : Visualization {
    return this.visualization;
  }
}
abstract class D3Element {
  protected d3Selection: any;

  constructor() {}
  /* Protected methods */
  protected abstract createD3Selection() : any

  /* Public methods */
  public getD3Selection() : any {
    return this.d3Selection;
  }
  public getHeight() : number {
    return this.d3Selection[0][0].getBBox().height;
  }
  public getWidth() : number {
    return this.d3Selection[0][0].getBBox().width;
  }
  public abstract getXPos() : number;
  public abstract getYPos() : number;

}
class Canvas extends D3Element {
  private parentChart: Chart;

  constructor(parentChart: Chart) {
    super();
    this.parentChart = parentChart;
    this.d3Selection = this.createD3Selection();
  }
  /* Protected methods */
  protected createD3Selection() : any {
    let d3SelectionParentChartContainer: any = this.parentChart
      .getD3SelectionParentContainer();

    let canvasWidth: number = d3SelectionParentChartContainer[0][0]
      .getBBox().width;
    let d3Selection = d3SelectionParentChartContainer
      .append('svg')
      .attr('class', 'canvas')
      .style('height', window.innerHeight)
      .style('width', canvasWidth);
    // Get correct value for canvasWidth. For some reason the correct value
    // is given only after appending the canvas, and only if the height of the
    // canvas is a large enough value.
    canvasWidth = d3SelectionParentChartContainer[0][0].getBBox().width;
    // Update canvas width
    d3Selection.style('width', canvasWidth);
    return d3Selection;
  }
  /* Public methods */
  public getParentChart(): Chart {
    return this.parentChart;
  }
  public getXPos() : number {
    return 0;
  }
  public getYPos() : number {
    return 0;
  }
}
abstract class ChartBody extends D3Element {
  protected collections: iCollection[];
  protected parentVisualization: Visualization;
  protected plotArea: any;

  constructor(parentVisualization: Visualization) {
    super();
    this.collections = this.getCollectionsFromSrc();
    this.parentVisualization = parentVisualization;
    this.plotArea = PlotAreaFactory.createPlotArea(this);
  }
  /* Private methods */
  private getCollectionsFromSrc() : iCollection[] {
    let collectionsSrc: iAlepNg2InputChartColl[] = this.parentVisualization
      .getParentCanvas()
      .getParentChart()
      .getInputChart()
      .collections;

    let collections: iCollection[] = [];
    let maxVal: number = 0;
    let minVal: number = 0;
    let dataPoints: any;
    let name: string;
    let labels: string[];
    let values: number[];
    for (let i = 0; i < collectionsSrc.length; i++) {
      dataPoints = collectionsSrc[i].dataSet.dataPoints;
      name = collectionsSrc[i].label;
      labels = [];
      values = [];
      for (let label in dataPoints) {
        maxVal = (dataPoints[label] > maxVal) ?
          dataPoints[label] :
          maxVal;
        minVal = (dataPoints[label] < minVal) ?
          dataPoints[label] :
          minVal;
        labels.push(label);
        values.push(dataPoints[label]);
      }
      collections.push(
        {
          labels: labels,
          maxVal: maxVal,
          minVal: minVal,
          name: name,
          values: values
        }
      );
    }
    return collections;
  }
  /* Protected methods */
  protected createD3Selection() : any {
    let parentCanvas: Canvas = this.parentVisualization.getParentCanvas();
    let xPos: number = this.getXPos();
    let yPos: number = this.getYPos();

    let d3Selection: any = parentCanvas.getD3Selection()
      .append('g')
      .attr('class', 'chart-body')
      .attr(
        'transform',
        `translate(${xPos} ${yPos})`);
    return d3Selection;
  }
  /* Public methods */
  public getCollections() : iCollection[] {
    return this.collections;
  }
  public getCollectionsMaxVal() : number {
    let collections: iCollection[] = this.collections;

    let maxVal: number = collections[0].values[0];
    for (let collection of collections) {
      for (let val of collection.values) {
        if (val > maxVal) {
          maxVal = val;
        }
      }
    }
    return maxVal;
  }
  public getCollectionsMinVal() : number {
    let collections: iCollection[] = this.collections;

    let minVal: number = collections[0].values[0];
    for (let collection of collections) {
      for (let val of collection.values) {
        if (val < minVal) {
          minVal = val;
        }
      }
    }
    return minVal;
  }
  public getParentVisualization() : Visualization {
    return this.parentVisualization;
  }
  public getPlotArea() : any {
    return this.plotArea;
  }
  public getXPos() : number {
    let parentCanvas: Canvas = this.parentVisualization.getParentCanvas();

    let styling: iStylingChart = parentCanvas.getParentChart().getStyling();
    let xPos: number = styling.chartBody.marginLeft[0];
    return xPos;
  }
  public getYPos() : number {
    let parentCanvas: Canvas = this.parentVisualization.getParentCanvas();

    let styling: iStylingChart = parentCanvas.getParentChart().getStyling();
    let yPos: number = styling.chartBody.marginTop[0];
    return yPos;
  }
}
abstract class ChartBodyFactory {
  public static createChartBody (parentVisualization: Visualization) : any {
    let chartType: string = parentVisualization
      .getParentCanvas()
      .getParentChart()
      .getInputChart()
      .type;
    switch(chartType) {
      case 'Bar':
        return new ChartBodyOrthogonal(parentVisualization);
      case 'Donut':
        return new ChartBodyCircular(parentVisualization);
      case 'Line':
        return new ChartBodyOrthogonal(parentVisualization);
      case 'Pie':
        return new ChartBodyCircular(parentVisualization);
    }
  }
}
class ChartBodyOrthogonal extends ChartBody {
  protected labelsAxis: any;
  protected valuesAxisLeft: ValuesAxisGroup;
  protected valuesAxisRight: ValuesAxisGroup = null;

  constructor(parentVisualization: Visualization) {
    super(parentVisualization);
    this.d3Selection = this.createD3Selection();
    this.valuesAxisLeft = new ValuesAxisGroup(this);
    this.labelsAxis = LabelsAxisGroupFactory.createLabelsAxis(this);
    this.plotArea.drawData();
  }
  /* Public methods */
  public getLabelsAxis(): any {
    return this.labelsAxis;
  }
  public getValuesAxisLeft(): ValuesAxisGroup {
    return this.valuesAxisLeft;
  }
  public getValuesAxisRight(): ValuesAxisGroup {
    return this.valuesAxisRight;
  }
}
class ChartBodyCircular extends ChartBody {
  private outerRadius: number;

  constructor(parentVisualization: Visualization) {
    super(parentVisualization);
    this.setOuterRadius();
    this.createD3Selection();
  }
  /* Private methods */
  private setOuterRadius() : void {
    let styling: iStylingChart = this.parentVisualization
      .getParentCanvas()
      .getParentChart()
      .getStyling();

    this.outerRadius = styling.chartBody.plotArea.slice.outerRadius ?
      styling.chartBody.plotArea.slice.outerRadius[0] :
      this.getWidth() / 2;
  }
  /* Public methods */
  public getOuterRadius() : number {
    return this.outerRadius;
  }
  public getXPos() : number {
    let outerRadius: number = this.outerRadius;
    let styling: iStylingChart = this.parentVisualization
      .getParentCanvas()
      .getParentChart()
      .getStyling();

    let xPos: number = styling.chartBody.marginLeft[0] + outerRadius;
    return xPos;
  }
  public getYPos() : number {
    let outerRadius: number = this.outerRadius;
    let styling: iStylingChart = this.parentVisualization
      .getParentCanvas()
      .getParentChart()
      .getStyling();

    let yPos: number = styling.chartBody.marginTop[0] + outerRadius;
    return yPos;
  }
}
abstract class LabelsAxisGroup extends D3Element {
  protected d3Scale: any;
  protected d3SelectionAxis: any;
  protected d3SelectionLabel: any;
  protected parentChartBody: ChartBodyOrthogonal;

  constructor(parentChartBody: ChartBodyOrthogonal) {
    super();
    this.parentChartBody = parentChartBody;
    this.setGeomInfo();
    this.d3Selection = this.createD3Selection();
    this.d3Scale = this.createD3Scale();
  }
  /* Private methods */
  private createD3Selection() : any {
    let parentChartBody = this.parentChartBody;
    let xPos: number = this.geomInfo.xPos;
    let yPos: number = this.geomInfo.yPos;

    let d3Selection: any = parentChartBody.getD3Selection()
      .append('g')
      .attr('class', 'horAxis')
      .attr('transform', `translate(${xPos} ${yPos})`);
    return d3Selection;
  }
  /* Protected methods */
  protected appendAxis() : any {
    let d3SelectionAxisGroup: any = this.d3Selection;
    let d3Scale: any = this.d3Scale;
    let labels: string[] = this.parentChartBody.getCollections()[0].labels;
    let plotAreaHeight: number = this.parentChartBody.getPlotArea()
      .getGeomInfo()
      .height;
    let styling: iStylingChart = this.parentChartBody
      .getParentCanvas()
      .getParentChart()
      .getStyling();

    let d3Axis: any = d3.svg.axis()
      .scale(d3Scale)
      .ticks(labels.length)
      .orient('bottom');
    let d3SelectionAxis: any = d3SelectionAxisGroup
      .append('g')
      .call(d3Axis)
      .attr('class', 'axis');
    let fontSize: number = styling.chartBody.vAxis.fontSize[0];
    let labelsAngle: number = styling.chartBody.hAxis.ticks.labelsAngle[0];
    let stroke: string;
    let strokeWidth: string;
    let tickOpacity: number;
    let tickStroke: string;
    let tickStrokeWidth: number;
    let gridOpacity: number;
    let gridStroke: string;
    let gridStrokeWidth: number;
    // Create tick labels
    d3SelectionAxis.selectAll('.tick text')
      .data(labels)
      .text((d) => {return d})
      .style({
        'font-size': fontSize,
        'text-anchor': 'end'
      })
      .attr({
        'dy': 0,
        'transform':
          `translate(0 ${fontSize}) rotate(${labelsAngle})`,
        'y': 0
      });
    // Styling axis
    stroke = styling.chartBody.hAxis.stroke[0];
    strokeWidth = styling.chartBody.hAxis.strokeWidth[0].toString() + 'px';
    d3SelectionAxis.select('.domain')
      .style({
        'fill': 'none',
        'stroke': stroke,
        'stroke-width': strokeWidth
      });
    // Styling tick lines
    tickOpacity = styling.chartBody.hAxis
      .ticks
      .opacity[0];
    tickStroke = styling.chartBody.hAxis
      .ticks
      .stroke[0];
    tickStrokeWidth =
      styling.chartBody.hAxis.ticks.strokeWidth[0];
    d3SelectionAxis.selectAll('.tick line')
      .attr('class', 'tick-line')
      .attr('y2', 6)
      .style({
        'opacity': tickOpacity,
        'stroke': tickStroke,
        'stroke-width': tickStrokeWidth
      });
    // Styling grid lines
    gridOpacity = styling.chartBody.hAxis
      .gridLines
      .opacity[0];
    gridStroke = styling.chartBody.hAxis
      .gridLines
      .stroke[0];
    gridStrokeWidth =
      styling.chartBody.hAxis.gridLines.strokeWidth[0];
    d3SelectionAxis.selectAll('.tick')
      .append('line')
      .attr('class', 'grid-line')
      .attr('y2', -plotAreaHeight)
      .style({
        'opacity': gridOpacity,
        'stroke': gridStroke,
        'stroke-width': gridStrokeWidth
      });
  }
  protected appendLabel() : any {
    let styling: iStylingChart = this.parentChartBody.getParentCanvas()
      .getParentChart()
      .getStyling();
    let plotAreaWidth: number = this.parentChartBody.getPlotArea()
      .getGeomInfo()
      .width;
    let axisGroupHeight: number = this.geomInfo.height;
    let d3SelectionAxisGroup: any = this.d3Selection;
    let text: string = this.parentChartBody.getParentCanvas().getParentChart()
      .getInputChart()
      .hAxisLabel;

    let marginTop: number = styling.chartBody.hAxis
      .label
      .marginTop[0];
    let fontSize: number = styling.chartBody.hAxis
      .label
      .fontSize[0];
    let fontWeight: string = styling.chartBody.hAxis
      .label
      .fontWeight[0];
    let x: number = plotAreaWidth / 2;
    let y: number = axisGroupHeight + fontSize;
    let d3SelectionLabel = d3SelectionAxisGroup
      .append('g')
      .attr('class', 'label')
      .append('text')
      .text(text)
      .attr({
        'dy': marginTop,
        'text-anchor': 'middle',
        'x': x,
        'y': y
      })
      .style({
        'font-size': fontSize,
        'font-weight': fontWeight
      });
    return d3SelectionLabel;
  }
  protected createD3Scale() : any {
    let hScale: any = d3.scale.linear()
      .domain([domainMin, domainMax])
      .range([rangeMin, rangeMax]);
    return hScale;
  }
  protected getHeight() : number {
    return this.d3Selection[0][0].getBBox().height;
  }
  protected getWidth() : number {
    return this.d3Selection[0][0].getBBox().width;
  }
  protected setGeomInfo() : void {
    let height: number = this.getHeight();
    let width: number = this.getWidth();
    let xPos: number = this.parentChartBody.getPlotArea().getDimensions().xPos;
    let yPos: number = this.parentChartBody.getPlotArea().getDimensions().height;

    this.geomInfo = {
      height: height,
      width: width,
      xPos: xPos,
      yPos: yPos
    };
  }
  /* Public methods */
  public getXPos() : number {
    let styling: iStylingChart = this.parentChartBody
      .getParentVisualization()
      .getParentCanvas()
      .getParentChart()
      .getStyling();

    let xPos: number = styling.chartBody.plotArea
    return xPos;
  }
  public getYPos() : number {
    let outerRadius: number = this.outerRadius;
    let styling: iStylingChart = this.parentVisualization
      .getParentCanvas()
      .getParentChart()
      .getStyling();

    let yPos: number = styling.chartBody.marginTop[0] + outerRadius;
    return yPos;
  }
}
class LabelsAxisGroupBar extends LabelsAxisGroup {
  constructor(parentChartBody: ChartBodyOrthogonal) {
    super(parentChartBody);
    this.d3SelectionAxis = this.appendAxis();
    this.adjustTickLabelsPosition();
    this.d3SelectionLabel = this.appendLabel();
  }
  /* Private methods */
  private adjustTickLabelsPosition() : void {
    let labels: string[] = this.parentChartBody.getCollections()[0].labels;
    let plotAreaWidth: number = this.parentChartBody.getPlotArea()
      .getGeomInfo()
      .width;
    let styling: iStylingChart = this.parentChartBody.getParentCanvas()
      .getParentChart()
      .getStyling();
    let d3SelectionTickLabels: any = this.d3SelectionAxis
      .selectAll('.tick text');

    let totDataPoints: number = labels.length;
    let dataGroupWidth: number = plotAreaWidth / totDataPoints;
    let labelsHorShift: number = dataGroupWidth / 2;
    let fontSize: number = styling.chartBody.vAxis.fontSize[0];
    let labelsAngle: number = styling.chartBody.hAxis
      .ticks
      .labelsAngle[0];
    d3SelectionTickLabels.attr(
      'transform',
      `translate(${labelsHorShift} ${fontSize}) rotate(${labelsAngle})`
    );
  }
}
abstract class LabelsAxisGroupFactory {
  /* Public methods */
  public static createLabelsAxis(parentChartBody: ChartBodyOrthogonal) : any {
    let chartType: string = parentChartBody
      .getParentCanvas()
      .getParentChart()
      .getInputChart()
      .type;
    switch(chartType) {
      case 'Bar':
        return new LabelsAxisGroupBar(parentChartBody);
      case 'Line':
        return new LabelsAxisGroupLine(parentChartBody);
    }
  }
}
class LabelsAxisGroupLine extends LabelsAxisGroup {
  constructor(parentChartBody: ChartBodyOrthogonal) {
    super(parentChartBody);
    this.d3SelectionAxis = this.appendAxis();
    this.d3SelectionLabel = this.appendLabel();
  }
}
abstract class Legend extends D3Element {
  private parentVisualization: Visualization;

  constructor(parentVisualization: Visualization) {
    super();
    this.parentVisualization = parentVisualization;
    this.d3Selection = this.createD3Selection();
  }
  /* Private methods */
  protected createD3Selection() : any {
    let parentCanvas: Canvas = this.parentVisualization.getParentCanvas();
    let xPos: number = this.getXPos();
    let yPos: number = this.getYPos();

    let d3Selection: any = parentCanvas.getD3Selection()
      .append('g')
      .attr('class', 'chart-legend')
      .attr('transform', `translate(${xPos} ${yPos})`);
    return d3Selection;
  }
  protected abstract getEntryLabels(collections: iCollection[]) : string[];
  protected createEntries() : void {
    let d3SelectionLegendGroup: any = this.d3Selection;
    let labels: string[] = this.parentVisualization
      .getChartBody()
      .getCollections()[0]
      .labels;
    let styling: iStylingChart = this.parentVisualization
      .getParentCanvas()
      .getParentChart()
      .getInputChart()
      .getStyling();
    let d3ScalePalette: any = this.parentVisualization
      .getChartBody()
      .getPlotArea()
      .

    for (let i = 0; i < labels.length; i++) {
      let marginTop: number = styling.legend.marginTop[0];
      let fontSize: number = styling.legend.legendEntry
        .text
        .fontSize[0];
      let textMarginLeft: number = styling.legend.legendEntry
        .text
        .marginLeft[0];
      let symbolHeight: number = styling.legend.legendEntry
        .symbol
        .height[0];
      let symbolWidth: number = styling.legend.legendEntry
        .symbol
        .width[0];
      let legendEntryHeight: number = Math.max(symbolHeight, fontSize);
      let legendEntryVPos: number = i * (marginTop + legendEntryHeight);
      let legendEntry: any = d3SelectionLegendGroup
        .append('g')
        .attr('class', 'legend-entry')
        .attr(
          'transform',
          `translate(0 ${legendEntryVPos})`
        );
      legendEntry
        .append('rect')
        .attr('class', 'legend-entry-symbol')
        .attr({
          'fill': d3ScalePalette(i),
          'height': symbolHeight,
          'width': symbolWidth
        });
      legendEntry
        .append('text')
        .attr('class', 'legend-entry-text')
        .text(labels[i])
        .attr({
          'font-size': fontSize,
          'transform':
            `translate(${symbolWidth + textMarginLeft} ${symbolHeight})`
        });
    }
  }
  /* Public methods */
  public getXPos() : number {
    let chartBodyXPos: number = this.parentVisualization
      .getChartBody()
      .getXPos();
    let plotAreaXPos: number = this.parentVisualization
      .getChartBody()
      .getPlotArea()
      .getXPos();

    return chartBodyXPos + plotAreaXPos;
  }
  public getYPos() : number {
    let chartBodyYPos: number = this.parentVisualization
      .getChartBody()
      .getYPos();
    let ChartBodyHeight: number = this.parentVisualization
      .getChartBody()
      .getHeight();
    let styling: iStylingChart = this.parentVisualization
      .getParentCanvas()
      .getParentChart()
      .getStyling();

    let legendMarginTop: number = styling.legend.marginTop[0];
    return chartBodyYPos + ChartBodyHeight + legendMarginTop;
  }
}
class LegendCircular extends Legend {
  constructor(
    parentCanvas: Canvas,
    hPos: number,
    vPos: number,
    collections: iCollection[],
    d3ScalePalette: any,
    styling: iStylingChart,
    screenSizeIndex: number
  ) {
    super(
      parentCanvas,
      hPos,
      vPos
    );
    this.createEntries(
      this.getEntryLabels(collections),
      d3ScalePalette,
      styling,
      screenSizeIndex
    );
  }

  protected getEntryLabels(collections: iCollection[]) : string[] {
    return collections[0].labels;
  }

}
abstract class LegendFactory {
  public static createLegend(
    chartType: string,
    parentCanvas: Canvas,
    hPos: number,
    vPos: number,
    collections: iCollection[],
    d3ScalePalette: any,
    styling: iStylingChart,
    screenSizeIndex: number
  ) : any {
    switch(chartType) {
      case 'Bar':
        return new LegendOrthogonal(
          parentCanvas,
          hPos,
          vPos,
          collections,
          d3ScalePalette,
          styling,
          screenSizeIndex
        );
      case 'Donut':
        return new LegendCircular(
          parentCanvas,
          hPos,
          vPos,
          collections,
          d3ScalePalette,
          styling,
          screenSizeIndex
        );
      case 'Line':
        return new LegendOrthogonal(
          parentCanvas,
          hPos,
          vPos,
          collections,
          d3ScalePalette,
          styling,
          screenSizeIndex
        );
      case 'Pie':
        return new LegendCircular(
          parentCanvas,
          hPos,
          vPos,
          collections,
          d3ScalePalette,
          styling,
          screenSizeIndex
        );
    }
  }
}
class LegendOrthogonal extends Legend {
  constructor(
    parentCanvas: Canvas,
    hPos: number,
    vPos: number,
    collections: iCollection[],
    d3ScalePalette: any,
    styling: iStylingChart,
    screenSizeIndex: number
  ) {
    super(
      parentCanvas,
      hPos,
      vPos
    );
  }

  protected getEntryLabels(collections: iCollection[]) : string[] {
    let labels: string[] = [];
    for (let collection of collections) {
      labels.push(collection.name);
    }
    return labels;
  }
}
abstract class PlotArea extends D3Element{
  private height: number;
  private parentChartBody: ChartBody;
  private width: number;
  private xPos: number;
  private yPos: number;

  public d3ScaleColorPalette: any;

  constructor(parentChartBody: ChartBody) {
    super();
    this.parentChartBody = parentChartBody;
  }
  /* Private methods */
  private setGeomInfo() : void {
    let aspectRatio: number = styling.aspectRatio[screenSizeIndex];
    let height: number = chartBodyWidth / aspectRatio;
    this.dimensions = {
      aspectRatio: aspectRatio,
      height: height,
      hPos: 0,
      width: chartBodyWidth
    };
  }
  private setHeight() : void {
    let aspectRatio: number = this.parentChartBody
      .getParentVisualization()
      .getParentCanvas()
      .getParentChart()
      .getStyling()
      .chartBody
      .plotArea
      .aspectRatio[0];
    this.height = this.width / aspectRatio;
  }
  private setWidth() : void {
    let width: number = /// CONTINUE HERE ///;
    this.height = this.width / aspectRatio;
  }
  private setXPos() : void {

  }
  private setYPos() : void {

  }
  /* Protected methods */
  protected createD3ScaleColorPalette() : any {
    let domain: number[] = [];
    for (let i = 0; i < domainLength; i++) {
      domain.push(i);
    }
    let d3ScaleColorPalette: any = d3.scale.ordinal()
      .domain(domain)
      .range(range);
    return d3ScaleColorPalette;
  }
  protected createD3Selection() : any {
    let d3Selection: any = d3SelectionChartBody
      .append('g')
      .attr('class', 'plotArea')
      .attr('transform', `translate(${hPos} 0)`);
    return d3Selection;
  }
  /* Public methods */
  public abstract drawData() : void;
  public getD3ScaleColorPalette() : any {
    return this.d3ScaleColorPalette;
  }
  public getXPos() : number {
    return 0;
  }
  public getYPos() : number {
    return 0;
  }
}
abstract class PlotAreaCircular extends PlotArea {
  protected innerRadius: number;
  protected outerRadius: number;

  constructor(
    chartBody: ChartBody,
    styling: iStylingChart,
    screenSizeIndex: number
  ) {
    super(
      chartBody,
      styling,
      screenSizeIndex
    );
    this.d3ScaleColorPalette = this.createD3ScaleColorPalette(
      chartBody.collections[0].labels.length,
      styling.chartBody.plotArea.paletteRange[screenSizeIndex],
    );
    this.d3Selection = this.createD3Selection(
      chartBody.d3Selection,
      this.dimensions.hPos
    );
  }
  public drawData(
    chartType: string,
    d3SelectionPlotArea: any,
    d3ScalePalette: any,
    collections: iCollection[],
    plotAreaDimensions: iPlotAreaGeomInfo,
    hScale: any,
    vScale: any,
    tooltip: any,
    styling: iStylingChart,
    screenSizeIndex: number
  ) : void {
    let innerRadius = this.innerRadius;
    let outerRadius = this.outerRadius;

    let newLine: string = '<br/>';
    let collection: iCollection = collections[0];
    let sliceArc: any = d3.svg.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);
    let pieLayout: any = d3.layout.pie()
      .sort(null)
      .value(function(d) {return d});
    let d3SelectionSlice: any = d3SelectionPlotArea.selectAll(".slice")
      .data(pieLayout(collection.values))
      .enter()
      .append("g")
      .attr("class", "slice");
    d3SelectionSlice.append("path")
      .attr("class", "arc")
      .attr("d", sliceArc)
      .style("fill", function(d, index) {return d3ScalePalette(index)})
      .on('mouseover', function(d, index) {
        // Add shadow
        this.setAttribute(
          'stroke',
          styling.chartBody.plotArea
            .slice
            .selectionOutline
            .color[screenSizeIndex]
        );
        this.setAttribute(
          'stroke-opacity',
          styling.chartBody.plotArea
            .slice
            .selectionOutline
            .opacity[screenSizeIndex]
        );
        this.setAttribute(
          'stroke-width',
          styling.chartBody.plotArea
            .slice
            .selectionOutline
            .width[screenSizeIndex]
        );
        // Define tooltip info
        tooltip.d3Selection.html(
          collection.name + newLine +
          collection.labels[index] + ': ' + d.value
        );
        // Show tooltip
        tooltip.show(d3SelectionPlotArea, styling, screenSizeIndex);
      })
      .on('mouseout', function(d) {
        // Remove shadow
        this.setAttribute('stroke', 'none');
        // Fade out tooltip
        tooltip.hide(styling, screenSizeIndex);
      });
    // If slice is selected, deselect it when user touches on body
    d3.select('body')[0][0]
      .addEventListener('touchstart', function() {
        // Deselect slice if selected
        let length: number = d3SelectionSlice[0].length;
        for (let i = 0; i < length; i++) {
          let sliceArcSelection: any = d3SelectionSlice[0][i]
            .querySelector('.arc');
          if (sliceArcSelection.getAttribute('stroke') !== 'none') {
            sliceArcSelection.setAttribute('stroke', 'none');
            break;
          }
        }
      });
  }
  protected abstract setRadii(
    styling: iStylingChart,
    screenSizeIndex: number
  ) : void;
}
class PlotAreaDonut extends PlotAreaCircular {
  constructor(
    chartBody: ChartBody,
    styling: iStylingChart,
    screenSizeIndex: number
  ) {
    super(
      chartBody,
      styling,
      screenSizeIndex
    );
    this.setRadii(styling, screenSizeIndex);
  }

  protected setRadii(
    styling: iStylingChart,
    screenSizeIndex: number
  ) : void {
    let width: number = this.dimensions.width;

    let outerRadius: number = styling.chartBody.plotArea.slice.outerRadius ?
      styling.chartBody.plotArea.slice.outerRadius[screenSizeIndex] :
      width / 2;
    this.outerRadius = outerRadius;
    this.innerRadius = styling.chartBody.plotArea.slice.innerRadius ?
      styling.chartBody.plotArea.slice.innerRadius[screenSizeIndex] :
      outerRadius / 3;
  }
}
class PlotAreaPie extends PlotAreaCircular {
  constructor(
    chartBody: ChartBody,
    styling: iStylingChart,
    screenSizeIndex: number
  ) {
    super(
      chartBody,
      styling,
      screenSizeIndex
    );
    this.setRadii(styling, screenSizeIndex);
  }

  protected setRadii(
    styling: iStylingChart,
    screenSizeIndex: number
  ) : void {
    let width: number = this.dimensions.width;

    this.outerRadius = styling.chartBody.plotArea.slice.outerRadius ?
      styling.chartBody.plotArea.slice.outerRadius[screenSizeIndex] :
      width / 2;
    this.innerRadius = 0;
  }
}
abstract class PlotAreaOrthogonal extends PlotArea {
  constructor(
    chartBody: ChartBody,
    styling: iStylingChart,
    screenSizeIndex: number
  ) {
    super(
      chartBody,
      styling,
      screenSizeIndex
    );
    this.d3ScaleColorPalette = this.createD3ScaleColorPalette(
      chartBody.collections.length,
      styling.chartBody.plotArea.paletteRange[screenSizeIndex],
    );
    this.adjustDimensions(
      styling,
      screenSizeIndex
    );
    this.d3Selection = this.createD3Selection(
      chartBody.d3Selection,
      this.dimensions.hPos
    );
  }

  private adjustDimensions(
    styling: iStylingChart,
    screenSizeIndex: number
  ) : void {
    let vAxisLeftWidth : number =
      styling.chartBody.vAxis.label.fontSize[screenSizeIndex] +
      styling.chartBody.vAxis.marginLeft[screenSizeIndex] +
      styling.chartBody.vAxis.fontSize[screenSizeIndex] * 2;
    let vAxisRightWidth : number = 0;
    this.dimensions.hPos += vAxisLeftWidth;
    this.dimensions.width -= (vAxisLeftWidth + vAxisRightWidth);
  }
  public abstract drawData(
    chartType: string,
    d3SelectionPlotArea: any,
    d3ScalePalette: any,
    collections: iCollection[],
    plotAreaDimensions: iPlotAreaGeomInfo,
    hScale: any,
    vScale: any,
    tooltip: any,
    styling: iStylingChart,
    screenSizeIndex: number
  ) : void;
}
class PlotAreaBar extends PlotAreaOrthogonal {
  constructor(
    chartBody: ChartBody,
    styling: iStylingChart,
    screenSizeIndex: number
  ) {
    super(
      chartBody,
      styling,
      screenSizeIndex
    );
  }

  public drawData(
    chartType: string,
    d3SelectionPlotArea: any,
    d3ScalePalette: any,
    collections: iCollection[],
    plotAreaDimensions: iPlotAreaGeomInfo,
    hScale: any,
    vScale: any,
    tooltip: any,
    styling: iStylingChart,
    screenSizeIndex: number
  ) : void {
    let newLine: string = '<br/>';
    let length_Collections: number = collections.length;
    let barGap: number = styling.chartBody.plotArea
      .bar.
      barGap[screenSizeIndex];
    let totDataPoints: number = collections[0].labels.length;
    let dataGroupPadding: number =
      styling.chartBody.plotArea.bar.dataGroupPadding[screenSizeIndex];
    let dataGroupWidth: number = plotAreaDimensions.width / totDataPoints;
    let barWidth: number =
      (dataGroupWidth -
      2 * dataGroupPadding -
      barGap * (length_Collections - 1)
      ) / length_Collections;
    let values: number[];
    for (let i = 0; i < length_Collections; i++) {
      values = collections[i].values;
      let d3SelectionCollection: any = d3SelectionPlotArea
        .append('g')
        .attr('class', 'collection');
      let d3SelectionBar: any = d3SelectionCollection.selectAll('.bar')
        .data(values)
        .enter()
        .append('rect')
        .attr({
          'class': 'bar',
          'x': function(d, index) {
            let result: number =
              hScale(index) +
              dataGroupPadding +
              barGap * i +
              barWidth * i;
            return result;
          },
          'y': function(d) { return vScale(d)},
          'fill': d3ScalePalette(i),
          'height': function(d) { return (vScale(0) - vScale(d))},
          'width': barWidth + 'px'
        })
        .on('mouseover', function(d, index) {
          // Add shadow
          this.setAttribute(
            'stroke',
            styling.chartBody.plotArea
              .bar
              .selectionOutline
              .color[screenSizeIndex]
          );
          this.setAttribute(
            'stroke-opacity',
            styling.chartBody.plotArea
              .bar
              .selectionOutline
              .opacity[screenSizeIndex]
          );
          this.setAttribute(
            'stroke-width',
            styling.chartBody.plotArea
              .bar
              .selectionOutline
              .width[screenSizeIndex] ||
            barGap * 2
          );
          // Define tooltip info
          tooltip.d3Selection.html(
            collections[i].name + newLine +
            collections[i].labels[index] + ': ' + d
          );
          // Show tooltip
          tooltip.show(d3SelectionPlotArea, styling, screenSizeIndex);
        })
        .on('mouseout', function(d) {
          // Remove shadow
          this.setAttribute('stroke', 'none');
          // Fade out tooltip
          tooltip.hide(styling, screenSizeIndex);
        });
      // If bar is selected, deselect it when user touches on body
      d3.select('body')[0][0]
        .addEventListener('touchstart', function() {
          // Deselect bar if selected
          let length: number = d3SelectionBar[0].length;
          for (let i = 0; i < length; i++) {
            if (d3SelectionBar[0][i].getAttribute('stroke') !== 'none') {
              d3SelectionBar[0][i].setAttribute('stroke', 'none');
              break;
            }
          }
        });
    }
  }
}
abstract class PlotAreaFactory {
  public static createPlotArea(
    chartType: string,
    chartBody: ChartBody,
    styling: iStylingChart,
    screenSizeIndex: number
  ) : any {
    switch(chartType) {
      case 'Bar':
        return new PlotAreaBar(
          chartBody,
          styling,
          screenSizeIndex
        );
      case 'Donut':
        return new PlotAreaDonut(
          chartBody,
          styling,
          screenSizeIndex
        );
      case 'Line':
        return new PlotAreaBar(
          chartBody,
          styling,
          screenSizeIndex
        );
      case 'Pie':
        return new PlotAreaPie(
          chartBody,
          styling,
          screenSizeIndex
        );
    }
  }
}
class PlotAreaLine extends PlotAreaOrthogonal {
  constructor(
    chartBody: ChartBody,
    styling: iStylingChart,
    screenSizeIndex: number
  ) {
    super(
      chartBody,
      styling,
      screenSizeIndex
    );
  }

  public drawData(
    chartType: string,
    d3SelectionPlotArea: any,
    d3ScalePalette: any,
    collections: iCollection[],
    plotAreaDimensions: iPlotAreaGeomInfo,
    hScale: any,
    vScale: any,
    tooltip: any,
    styling: iStylingChart,
    screenSizeIndex: number
  ) : void {
    let newLine: string = '<br/>';
    let dataPointDiameter: string = styling.chartBody.plotArea
        .dataPoint
        .diameterDeselected[screenSizeIndex] + 'px';
    let dataPointDiameterSelected: string = styling.chartBody.plotArea
        .dataPoint
        .diameterSelected[screenSizeIndex] + 'px';
    let strokeWidth: string =
      styling.chartBody.plotArea.path.strokeWidthDeselected[screenSizeIndex]
        .toString() + 'px';
    let strokeWidthSelected: string =
      styling.chartBody.plotArea.path.strokeWidthSelected[screenSizeIndex]
        .toString() + 'px';
    let strokeOpacity: number =
      styling.chartBody.plotArea.path.strokeOpacity[screenSizeIndex];
    let length_Collections: number = collections.length;
    let values: number[];
    for (let i = 0; i < length_Collections; i++) {
      values = collections[i].values;
      let lineGenerator: any = d3.svg.line()
        .x(function(d, index) {return hScale(index)})
        .y(function(d) { return vScale(d)})
        .interpolate('linear');
      let collection: any = d3SelectionPlotArea
        .append('g')
        .attr('class', 'collection');
      // Path
      let path: any = collection
        .append('path')
        .attr({
          class: 'path',
          d: lineGenerator(values)
        })
        .style({
          fill: 'none',
          stroke: d3ScalePalette(i),
          'stroke-opacity': strokeOpacity,
          'stroke-width': strokeWidth
        })
        .on('mouseover', function(d) {
          this.style.strokeWidth = strokeWidthSelected
        })
        .on('mouseout', function(d) {
          this.style.strokeWidth = strokeWidth
        });
      // Data points
      let dataPointsSelection: any = collection.selectAll('circle')
        .data(values)
        .enter()
        .append('circle')
        .attr({
          'class': 'dataPoint',
          'cx': function(d, index) {return hScale(index)},
          'cy': function(d) { return vScale(d)},
          'fill': d3ScalePalette(i),
          'r': dataPointDiameter
        })
        .on('mouseover', function(d, index) {
          // Increase radius
          this.setAttribute('r', dataPointDiameterSelected);
          // Define tooltip info
          tooltip.d3Selection.html(
            collections[i].name + newLine +
            collections[i].labels[index] + ': ' + d
          );
          // Show tooltip
          tooltip.show(
            d3SelectionPlotArea,
            styling,
            screenSizeIndex
          );
        })
        .on('mouseout', function(d) {
          // Decrease radius
          this.setAttribute('r', dataPointDiameter);
          // Fade out tooltip
          tooltip.hide(styling, screenSizeIndex);
        });
      // If data point is selected, deselect it when user touches on body
      d3.select('body')[0][0]
        .addEventListener('touchstart', function() {
          // Deselect data point if selected
          let length: number = dataPointsSelection[0].length;
          for (let i = 0; i < length; i++) {
            if (
              dataPointsSelection[0][i].getAttribute('r') ===
              dataPointDiameterSelected
            ) {
              dataPointsSelection[0][i].setAttribute('r', dataPointDiameter);
              break;
            }
          }
        });
    }
  }
}
abstract class WrappableD3TextElement extends D3Element {
  constructor() {
    super();
  }

  protected wrap(d3SelectionText: any, width: number) : void {
    let words = d3SelectionText.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      x = d3SelectionText.attr("x"),
      y = d3SelectionText.attr("y"),
      dy = 0,
      fontSize = 1 + 'em',
      fontWeight = d3SelectionText.style('font-weight'),
      tSpan = d3SelectionText.text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", dy + "em")
        .style({
          'font-size': fontSize,
          'font-weight': fontWeight
        });
    while (word = words.pop()) {
      line.push(word);
      tSpan.text(line.join(" "));
      if (tSpan.node().getComputedTextLength() > width) {
        line.pop();
        tSpan.text(line.join(" "));
        line = [word];
        tSpan = d3SelectionText.append("tspan")
          .text(word)
          .attr("x", x)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .style({
            'font-size': fontSize,
            'font-weight': fontWeight
          });
      }
    }
  }
}
class Subtitle extends WrappableD3TextElement {
  private parentCanvas: Canvas;

  constructor(parentCanvas: Canvas) {
    super();
    this.parentCanvas = parentCanvas;
    this.d3Selection = this.createD3Selection();
  }
  /* Protected methods */
  protected createD3Selection() : any {
    let parentCanvas: Canvas = this.parentCanvas;
    let styling: iStylingChart = this.parentCanvas
      .getParentChart()
      .getStyling();

    let text: string = parentCanvas.getParentChart().getInputChart().subtitle;
    let width: number = this.parentCanvas.getWidth();
    let xPos: number = this.getXPos();
    let yPos: number = this.getYPos();

    let d3Selection: any = parentCanvas.getD3Selection().append('text')
      .text(text)
      .attr('class', 'chart-subtitle')
      .attr({
        'transform': `translate(${xPos} ${yPos})`,
        'x': width / 2,
        'y': styling.subtitle.fontSize[0]
      })
      .style({
        'font-size': styling.subtitle.fontSize[0] + 'px',
        'font-weight': styling.subtitle.fontWeight[0],
        'text-anchor': 'middle'
      });
    this.wrap(this.d3Selection, width);
    return d3Selection;
  }
  /* Public methods */
  public getXPos() : number {
    return 0;
  }
  public getYPos() : number {
    let styling: iStylingChart = this.parentCanvas
      .getParentChart()
      .getStyling();
    let title: Title = this.parentCanvas.getParentChart().getTitle();

    let yPos: number =
      title.getHeight() +
      title.getYPos() +
      styling.subtitle.marginTop[0];
    return yPos;
  }
}
class Title extends WrappableD3TextElement {
  private parentCanvas: any;

  constructor(parentCanvas: Canvas) {
    super();
    this.parentCanvas = parentCanvas;
    this.d3Selection = this.createD3Selection();
  }
  /* Protected methods */
  protected createD3Selection() : any {
    let parentCanvas: Canvas = this.parentCanvas;
    let styling: iStylingChart = this.parentCanvas
      .getParentChart()
      .getStyling();
    let text: string = this.parentCanvas.getParentChart().getInputChart()
      .title;
    let width: number = this.parentCanvas.getWidth();
    let xPos: number = this.getXPos();
    let yPos: number = this.getYPos();

    let d3Selection: any = parentCanvas.getD3Selection().append('text')
      .attr('class', 'chart-title')
      .text(text)
      .attr({
        'transform': `translate(${xPos} ${yPos})`,
        'x': width / 2,
        'y': styling.title.fontSize[0]
      })
      .style({
        'font-size': styling.title.fontSize[0] + 'px',
        'font-weight': styling.title.fontWeight[0],
        'text-anchor': 'middle'
      });
    this.wrap(d3Selection, width);
    return d3Selection;
  }
  /* Public methods */
  public getXPos() : number {
    return 0;
  }
  public getYPos() : number {
    let styling: iStylingChart = this.parentCanvas
      .getParentChart()
      .getStyling();

    let yPos: number = styling.title.marginTop[0];
    return yPos;
  }
}
class Tooltip {
  private chartContainerId: number;
  private d3Selection: any;
  private parentD3SelectionDocumentBody: any;
  private styling: iStylingChart;

  constructor(
    parentD3SelectionDocumentBody: any,
    chartContainerId: number,
    styling: iStylingChart
  ) {
    this.parentD3SelectionDocumentBody = parentD3SelectionDocumentBody;
    this.chartContainerId = chartContainerId;
    this.styling = styling;
    this.d3Selection = this.createD3Selection();
    this.fadeOutOnBodyTouchstart();
  }
  /* Private methods */
  private createD3Selection() {
    let chartContainerId: number = this.chartContainerId;
    let parentD3SelectionDocumentBody: any = this.parentD3SelectionDocumentBody;
    let styling: iStylingChart = this.styling;

    let tooltipSelection: any = parentD3SelectionDocumentBody
      .append('div')
      .attr('class', 'alep-ng2-chart-tooltip')
      .style({
        'background': styling.tooltip.backgroundColor[0],
        'border-color': styling.tooltip.borderColor[0],
        'border-radius': styling.tooltip.borderRadius[0] + 'px',
        'color': styling.tooltip.fontColor[0],
        'font-size': styling.tooltip.fontSize[0] + 'px',
        'left': '0px',
        'opacity': 0,
        'padding-bottom': styling.tooltip.paddingBottom[0] + 'px',
        'padding-left': styling.tooltip.paddingLeft[0] + 'px',
        'padding-right': styling.tooltip.paddingRight[0] + 'px',
        'padding-top': styling.tooltip.paddingTop[0] + 'px',
        'top': '0px',
        'position': 'absolute'
      });
    tooltipSelection[0][0].setAttribute(
      'tooltip-id', chartContainerId
    );
    return tooltipSelection;
  }
  private fadeOutOnBodyTouchstart() : void {
    let d3Selection: any = this.d3Selection;
    let styling: iStylingChart = this.styling;

    let fadeOutDuration: number = styling.tooltip
      .fadeOutDuration[0];
    d3.select('body')[0][0]
      .addEventListener('touchstart', function() {
        // Fade out tooltip if active
        if (
          d3Selection.style('opacity') ===
          styling.tooltip.opacity[0].toString()
        ) {
          d3Selection.transition()
            .duration(fadeOutDuration)
            .style('opacity', 0);
        }
      });
  }
  /* Public methods */
  public hide() : void {
    let styling: iStylingChart = this.styling;

    let fadeOutDuration: number = styling.tooltip.fadeOutDuration[0];
    this.d3Selection.transition()
      .duration(fadeOutDuration)
      .style('opacity', 0);
  }
  public show(d3SelectionPlotArea: any) : void {
    let d3Selection: any = this.d3Selection;
    let styling: iStylingChart = this.styling;

    let fadeInDuration: number = styling.tooltip.fadeInDuration[0];
    let width: number = d3Selection[0][0].offsetWidth;
    d3Selection
      .style('left', function() {
        let plotAreaMarginLeft: number = d3SelectionPlotArea[0][0]
          .getBoundingClientRect().left;
        let plotAreaWidth: number = d3SelectionPlotArea[0][0]
          .getBoundingClientRect().width;
        let result: string =
          (d3.event.pageX - plotAreaMarginLeft) < plotAreaWidth / 2 ?
          d3.event.pageX + 'px' :
          (d3.event.pageX - width) + 'px';
        return result;
      })
      .style('top', (d3.event.pageY - 4 * 12) + 'px');
    d3Selection.transition()
      .duration(fadeInDuration)
      .style(
        'opacity',
        styling.tooltip.opacity[0]
      );
  }
}
class ValuesAxisGroup extends D3Element {
  private d3SelectionAxis: any;
  private d3SelectionLabel: any;
  private d3Scale: any;
  private parentChartBody: ChartBodyOrthogonal;

  constructor(parentChartBody: ChartBodyOrthogonal) {
    super();
    this.parentChartBody = parentChartBody;
    this.d3Selection = this.createD3Selection();
    this.d3Scale = this.createD3Scale();
    this.d3SelectionAxis = this.appendAxis();
    this.d3SelectionLabel = this.appendLabel();
  }
  /* Private methods */
  private appendAxis() : any {
    let d3Scale: any = this.d3Scale;
    let d3Selection: any = this.d3Selection;
    let styling: iStylingChart = this.parentChartBody
      .getParentVisualization()
      .getParentCanvas()
      .getParentChart()
      .getInputChart()
      .getStyling();
    let xPos: number = this.getXPos();
    let yPos: number = this.getYPos();
    let plotAreaWidth: number = this.getParentChartBody()
      .getPlotArea()
      .getWidth();

    let d3Axis: any = d3.svg.axis()
      .scale(d3Scale)
      .orient('left');
    let d3SelectionAxis: any = d3Selection
      .append('g')
      .call(d3Axis)
      .attr({
        'class': 'axis',
        'transform': `translate(${xPos} ${yPos})`
      });
    // Styling axis
    let stroke: string = styling.chartBody.vAxis.stroke[0];
    let strokeWidth: string =
      styling.chartBody.vAxis.strokeWidth[0].toString() + 'px';
    d3SelectionAxis.select('.domain')
      .style({
        'fill': 'none',
        'stroke': stroke,
        'stroke-width': strokeWidth
      });
    // Styling tick lines
    let tickOpacity: number = styling.chartBody.vAxis.ticks.opacity[0];
    let tickStroke: string = styling.chartBody.vAxis.ticks.stroke[0];
    let tickStrokeWidth: number =
      styling.chartBody.vAxis.ticks.strokeWidth[0];
    d3SelectionAxis.selectAll('.tick line')
      .attr('class', 'tick-line')
      .attr('x2', -6)
      .style({
        'opacity': tickOpacity,
        'stroke': tickStroke,
        'stroke-width': tickStrokeWidth
      });
    // Styling tick labels
    let fontSize: number = styling.chartBody.vAxis.fontSize[0];
    d3SelectionAxis.selectAll('.tick text')
      .style({
        'font-size': fontSize
      });
    // Styling grid lines
    let gridOpacity: number = styling.chartBody.vAxis.gridLines.opacity[0];
    let gridStroke: string = styling.chartBody.vAxis.gridLines.stroke[0];
    let gridStrokeWidth: number =
      styling.chartBody.vAxis.gridLines.strokeWidth[0];
    d3SelectionAxis.selectAll('.tick')
      .append('line')
      .attr('class', 'grid-line')
      .attr('x2', plotAreaWidth)
      .style({
        'opacity': gridOpacity,
        'stroke': gridStroke,
        'stroke-width': gridStrokeWidth
      });
    return d3SelectionAxis;
  }
  private appendLabel() : any {
    let d3Selection : any = this.d3Selection;
    let styling: iStylingChart = this.parentChartBody
      .getParentVisualization()
      .getParentCanvas()
      .getParentChart()
      .getInputChart()
      .getStyling();
    let text: string = this.getParentChartBody()
      .getParentVisualization()
      .getParentCanvas()
      .getParentChart()
      .getInputChart()
      .vAxisLabel;
    let yPos: number = this.parentChartBody
      .getPlotArea()
      .getHeight() / 2;

    let xPos: number = styling.chartBody.marginLeft[0];
    let fontSize: number = styling.chartBody.vAxis
      .label
      .fontSize[0];
    let fontWeight: string = styling.chartBody.vAxis
      .label
      .fontWeight[0];
    let dy: number = 0.75 * fontSize;
    let d3SelectionLabel = d3Selection
      .append('g')
      .attr('class', 'label')
      .append('text')
      .text(text)
      .attr({
        'dy': dy,
        'text-anchor': 'middle',
        'transform': `rotate(-90 ${xPos} ${yPos})`,
        'x': xPos,
        'y': yPos
      })
      .style({
        'font-size': fontSize,
        'font-weight': fontWeight
      });
    return d3SelectionLabel;
  }
  private createD3Scale() : any {
    let domainMin: number = this.getParentChartBody().getCollectionsMinVal();
    let domainMax: number = this.getParentChartBody().getCollectionsMaxVal();
    let rangeMin: number = 0;
    let rangeMax: number = this.parentChartBody.getPlotArea().getWidth();

    let d3Scale: any = d3.scale.linear()
      .domain([domainMin, domainMax])
      .range([rangeMax, rangeMin]);
    return d3Scale;
  }
  /* Protected methods */
  protected createD3Selection() : any {
    let d3SelectionAxisGroup: any = this.parentChartBody.getD3Selection()
      .append('g')
      .attr('class', 'vertAxis');
    return d3SelectionAxisGroup;
  }
  /* Public methods */
  public getParentChartBody() : ChartBodyOrthogonal {
    return this.parentChartBody;
  }
  public getXPos() : number {
    let styling: iStylingChart = this.parentChartBody
      .getParentVisualization()
      .getParentCanvas()
      .getParentChart()
      .getInputChart()
      .getStyling();
    let xPos: number =
      styling.chartBody.marginLeft[0] +
      styling.chartBody.vAxis.label.fontSize[0] +
      styling.chartBody.vAxis.marginLeft[0] +
      styling.chartBody.vAxis.fontSize[0] * 2;
    return xPos;
  }
  public getYPos() : number {
    return 0;
  }
}
class Visualization extends D3Element{
  private chartBody: any;
  private legend: any;
  private parentCanvas: Canvas;

  constructor(parentCanvas: Canvas) {
    super();
    this.parentCanvas = parentCanvas;
    this.createD3Selection();
    this.chartBody = ChartBodyFactory.createChartBody(this);
    this.legend = LegendFactory.createLegend(this);
  }
  /* Protected methods */
  protected createD3Selection() : any {
    let parentCanvas: Canvas = this.parentCanvas;

    let d3Selection: any = parentCanvas.getD3Selection()
      .append('g')
      .attr('class', 'visualization');
    return d3Selection;
  }
  /* Public methods */
  public getChartBody(): any {
    return this.chartBody;
  }
  public getLegend(): any {
    return this.legend;
  }
  public getParentCanvas(): any {
    return this.parentCanvas;
  }
  public getXPos() : number {
    return 0;
  }
  public getYPos() : number {
    let parentCanvas: Canvas = this.parentCanvas;

    let chartSubtitle: Subtitle = parentCanvas.getParentChart().getSubtitle();
    let yPos: number =
      chartSubtitle.getYPos() +
      chartSubtitle.getHeight();
    return yPos;
  }
}
interface iCollection {
  labels: string[],
  maxVal: number,
  minVal: number,
  name: string,
  values: number[]
}
interface iDefaultChartStylings {
  barStyling: iStylingChart,
  donutStyling: iStylingChart,
  lineStyling: iStylingChart,
  pieStyling: iStylingChart
}
interface iGeomInfo {
  height: number,
  width: number,
  xPos: number,
  yPos: number
}
interface iPlotAreaGeomInfo extends iGeomInfo {
  aspectRatio: number
}

@Component({
  selector: 'alep-ng2-chart-d3',
  templateUrl: 'alep-ng2-chart_d3.component.html',
  styleUrls: ['alep-ng2-chart_d3.component.css']
})
export class AlepNg2ChartD3Component implements OnDestroy, OnInit {
  @HostListener('window:resize', ['$event'])
  private onResize(event: any) {
    this.emOnWindowResize.emit();
  }
  @Input() private emUpdateChart: EventEmitter<any>;
  @Input() private inputChart: iAlepNg2InputChart;
  @Input() private inputChartStyling: Object = {};
  @ViewChild(
    'alepNg2ChartContainer'
  ) private alepNg2ChartContainerChild: ElementRef;
  private chartContainerId: number;
  private chartStyling: iStylingChart;
  private defaultChartStylings: iDefaultChartStylings = {
    barStyling: {
      backgroundColor: ['white'],
      chartBody: {
        hAxis: {
          fontSize: [9, 15],
          gridLines: {
            opacity: [0.3],
            stroke: ['none'],
            strokeWidth: [1]
          },
          label: {
            fontSize: [12, 20],
            fontWeight: ['normal'],
            marginTop: [0]
          },
          stroke: ['black'],
          strokeWidth: [2],
          ticks: {
            labelsAngle: [-30],
            opacity: [1],
            stroke: ['black'],
            strokeWidth: [1]
          }
        },
        marginLeft: [10],
        marginRight: [10, 30, 30],
        marginTop: [30],
        plotArea: {
          aspectRatio: [1, 1, 2],
          bar: {
            barGap: [1, 2, 2],
            dataGroupPadding: [2, 6, 6],
            selectionOutline: {
              color: ['black'],
              opacity: [0.7],
              width: [0]
            }
          },
          dataPoint: null,
          paletteRange: [
            [
              '#F15854',
              '#5DA5DA',
              '#FAA43A',
              '#60BD68',
              '#F17CB0',
              '#B2912F',
              '#B276B2',
              '#DECF3F',
              '#4D4D4D'
            ]
          ],
          path: null,
          slice: null,
        },
        vAxis: {
          fontSize: [9, 15],
          gridLines: {
            opacity: [0.3],
            stroke: ['grey'],
            strokeWidth: [1]
          },
          label: {
            fontSize: [12, 20],
            fontWeight: ['normal']
          },
          marginLeft: [10],
          stroke: ['black'],
          strokeWidth: [2],
          ticks: {
            opacity: [1],
            stroke: ['black'],
            strokeWidth: [1]
          }
        }
      },
      largeScreenSize: 767,
      legend: {
        legendEntry:{
          symbol: {
            height:  [12, 15, 15],
            width:  [28, 36, 36],
          },
          text:{
            fontSize: [10],
            fontWeight: ['normal'],
            marginLeft: [10]
          }
        },
        marginBottom: [10],
        marginTop: [10]
      },
      mediumScreenSize: 450,
      subtitle: {
        fontSize: [12, 20],
        fontWeight: ['normal'],
        marginTop: [10],
      },
      title: {
        fontSize: [15, 25],
        fontWeight: ['bold'],
        marginTop: [10],
      },
      tooltip: {
        backgroundColor: ['#1a1a1a'],
        borderColor: ['none'],
        borderRadius: [8],
        borderWidth: [0],
        fadeInDuration: [200],
        fadeOutDuration: [500],
        fontSize: [12],
        fontColor: ['white'],
        opacity: [1],
        paddingBottom: [5],
        paddingLeft: [5],
        paddingRight: [5],
        paddingTop: [5]
      }
    },
    donutStyling: {
      backgroundColor: ['white'],
      chartBody: {
        hAxis: null,
        marginLeft: [10, 20,200],
        marginRight: [10, 20,200],
        marginTop: [30],
        plotArea: {
          aspectRatio: [1, 1, 1],
          bar: null,
          dataPoint: null,
          paletteRange: [
            [
              '#F15854',
              '#5DA5DA',
              '#FAA43A',
              '#60BD68',
              '#F17CB0',
              '#B2912F',
              '#B276B2',
              '#DECF3F',
              '#4D4D4D'
            ]
          ],
          path: null,
          slice: {
            innerRadius: null,
            selectionOutline: {
              color: ['black'],
              opacity: [0.7],
              width: [2]
            },
            outerRadius: null
          },
        },
        vAxis: null
      },
      largeScreenSize: 767,
      legend: {
        legendEntry:{
          symbol: {
            height:  [12, 15, 15],
            width:  [28, 36, 36],
          },
          text:{
            fontSize: [10],
            fontWeight: ['normal'],
            marginLeft: [10]
          }
        },
        marginBottom: [10],
        marginTop: [10]
      },
      mediumScreenSize: 450,
      subtitle: {
        fontSize: [12, 20],
        fontWeight: ['normal'],
        marginTop: [10],
      },
      title: {
        fontSize: [15, 25],
        fontWeight: ['bold'],
        marginTop: [10],
      },
      tooltip: {
        backgroundColor: ['#1a1a1a'],
        borderColor: ['none'],
        borderRadius: [8],
        borderWidth: [0],
        fadeInDuration: [200],
        fadeOutDuration: [500],
        fontSize: [12],
        fontColor: ['white'],
        opacity: [1],
        paddingBottom: [5],
        paddingLeft: [5],
        paddingRight: [5],
        paddingTop: [5]
      }
    },
    lineStyling: {
      backgroundColor: ['white'],
      chartBody: {
        hAxis: {
          fontSize: [9, 15],
          gridLines: {
            opacity: [0.3],
            stroke: ['none'],
            strokeWidth: [1]
          },
          label: {
            fontSize: [12, 20],
            fontWeight: ['normal'],
            marginTop: [0]
          },
          stroke: ['black'],
          strokeWidth: [2],
          ticks: {
            labelsAngle: [-30],
            opacity: [1],
            stroke: ['black'],
            strokeWidth: [1]
          }
        },
        marginLeft: [10],
        marginRight: [10, 30, 30],
        marginTop: [30],
        plotArea: {
          aspectRatio: [1, 1, 2],
          bar: null,
          dataPoint: {
            diameterDeselected: [4],
            diameterSelected: [6]
          },
          paletteRange: [
            [
              '#F15854',
              '#5DA5DA',
              '#FAA43A',
              '#60BD68',
              '#F17CB0',
              '#B2912F',
              '#B276B2',
              '#DECF3F',
              '#4D4D4D'
            ]
          ],
          path: {
            strokeOpacity: [1],
            strokeWidthDeselected: [3],
            strokeWidthSelected: [5],
          },
          slice: null,
        },
        vAxis: {
          fontSize: [9, 15],
          gridLines: {
            opacity: [0.3],
            stroke: ['grey'],
            strokeWidth: [1]
          },
          label: {
            fontSize: [12, 20],
            fontWeight: ['normal']
          },
          marginLeft: [10],
          stroke: ['black'],
          strokeWidth: [2],
          ticks: {
            opacity: [1],
            stroke: ['black'],
            strokeWidth: [1]
          }
        }
      },
      largeScreenSize: 767,
      legend: {
        legendEntry:{
          symbol: {
            height:  [12, 15, 15],
            width:  [28, 36, 36],
          },
          text:{
            fontSize: [10],
            fontWeight: ['normal'],
            marginLeft: [10]
          }
        },
        marginBottom: [10],
        marginTop: [10]
      },
      mediumScreenSize: 450,
      subtitle: {
        fontSize: [12, 20],
        fontWeight: ['normal'],
        marginTop: [10],
      },
      title: {
        fontSize: [15, 25],
        fontWeight: ['bold'],
        marginTop: [10],
      },
      tooltip: {
        backgroundColor: ['#1a1a1a'],
        borderColor: ['none'],
        borderRadius: [8],
        borderWidth: [0],
        fadeInDuration: [200],
        fadeOutDuration: [500],
        fontSize: [12],
        fontColor: ['white'],
        opacity: [1],
        paddingBottom: [5],
        paddingLeft: [5],
        paddingRight: [5],
        paddingTop: [5]
      }
    },
    pieStyling: {
      backgroundColor: ['white'],
      chartBody: {
        hAxis: null,
        marginLeft: [10, 20,200],
        marginRight: [10, 20,200],
        marginTop: [30],
        plotArea: {
          aspectRatio: [1, 1, 1],
          bar: null,
          dataPoint: null,
          paletteRange: [
            [
              '#F15854',
              '#5DA5DA',
              '#FAA43A',
              '#60BD68',
              '#F17CB0',
              '#B2912F',
              '#B276B2',
              '#DECF3F',
              '#4D4D4D'
            ]
          ],
          path: null,
          slice: {
            innerRadius: [0],
            selectionOutline: {
              color: ['black'],
              opacity: [0.7],
              width: [2]
            },
            outerRadius: null
          },
        },
        vAxis: null
      },
      largeScreenSize: 767,
      legend: {
        legendEntry:{
          symbol: {
            height:  [12, 15, 15],
            width:  [28, 36, 36],
          },
          text:{
            fontSize: [10],
            fontWeight: ['normal'],
            marginLeft: [10]
          }
        },
        marginBottom: [10],
        marginTop: [10]
      },
      mediumScreenSize: 450,
      subtitle: {
        fontSize: [12, 20],
        fontWeight: ['normal'],
        marginTop: [10],
      },
      title: {
        fontSize: [15, 25],
        fontWeight: ['bold'],
        marginTop: [10],
      },
      tooltip: {
        backgroundColor: ['#1a1a1a'],
        borderColor: ['none'],
        borderRadius: [8],
        borderWidth: [0],
        fadeInDuration: [200],
        fadeOutDuration: [500],
        fontSize: [12],
        fontColor: ['white'],
        opacity: [1],
        paddingBottom: [5],
        paddingLeft: [5],
        paddingRight: [5],
        paddingTop: [5]
      }
    }
  };
  private emOnWindowResize: EventEmitter<any> = new EventEmitter();
  private subOnWindowResize: Subscription;
  private subUpdateChart: Subscription;
  private validTypes: string[] = [
    'Bar',
    'Donut',
    'Line',
    'Pie'
  ];

  constructor() {
  }

  ngOnInit() {
    this.createSubs();
    this.setChartContainerId();
    if (this.inputIsValid()) {
      this.assignIdToChartContainer();
      this.setChartStyling();
      this.createChart();
    }
  }
  ngOnDestroy() {
    this.cancelSubs();
    this.destroyCanvas();
  }

  private assignIdToChartContainer() : void {
    let chartContainerId: number = this.chartContainerId;

    this.alepNg2ChartContainerChild.nativeElement.setAttribute(
      'container-id',
      chartContainerId
    );
  }
  private cancelSubs() : void {
    this.subOnWindowResize.unsubscribe();
    this.subUpdateChart.unsubscribe();
  }
  private checkChartType(chartType: string, validTypes: string[]) : void {
    let typeIndex: number = validTypes.indexOf(chartType);
    if (typeIndex === -1) {
      throw new Error(`Chart type '${chartType}' is not a valid type.`);
    }
  }
  private createChart() : void {
    let chartContainerId: number = this.chartContainerId;
    let inputChart: iAlepNg2InputChart = this.inputChart;
    let styling: iStylingChart = this.chartStyling;

    new Chart(
      d3.select(`.alep-ng2-chart-container[container-id="${chartContainerId}"`),
      inputChart,
      styling
    );
  }
  private createSubs(): void {
    let emOnWindowResize: EventEmitter<any> = this.emOnWindowResize;
    let emUpdateChart: EventEmitter<any> = this.emUpdateChart;

    if (emUpdateChart) {
      this.subUpdateChart = this.emUpdateChart.subscribe(() => {
        if (this.inputIsValid()) {
          this.updateChart();
        }
      });
    }
    this.subOnWindowResize = emOnWindowResize.subscribe(() => {
      if (this.inputIsValid()) {
        this.updateChart();
      }
    });
  }
  private destroyCanvas() : void {
    let chartContainer: HTMLElement =
      this.alepNg2ChartContainerChild.nativeElement;

    let canvas: SVGSVGElement = chartContainer.getElementsByTagName('svg')[0];
    chartContainer.removeChild(canvas);
  }
  private getScreenSizeIndex(styling: iStylingChart) : number {
    let index: number;
    let width: number = window.innerWidth;
    if (width < styling.mediumScreenSize) {
      index = 0;
    }
    else if (width >= styling.mediumScreenSize &&
      width < styling.largeScreenSize) {
      index = 1;
    }
    else {
      index = 2;
    }
    return index;
  }
  private getChartStylingForCurrentScreenSize(
    responsiveStyling: iStylingChart
  ) : iStylingChart {
    let screenSizeIndex: number = this.getScreenSizeIndex(responsiveStyling);
    let result: Object = {};
    this.getChartStylingForCurrentScreenSize_recursivePart(
      responsiveStyling,
      result,
      screenSizeIndex
    );
    return (<iStylingChart>result);
  }
  private getChartStylingForCurrentScreenSize_recursivePart(
    styling: iStylingChart,
    result: Object,
    screenSizeIndex: number
  ) : void {
    for (let prop in styling) {
      if (styling[prop] === null) {
        continue;
      }
      else if (this.isObject(styling[prop])) {
        result[prop] = {};
        this.getChartStylingForCurrentScreenSize_recursivePart(
          styling[prop],
          result[prop],
          screenSizeIndex
      );
      }
      else {
        if (styling[prop].length === 0) {
          result[prop] = [null];
        }
        else if (styling[prop].length < (screenSizeIndex + 1)) {
          result[prop] = styling[prop][styling[prop].length - 1];
        }
        else {
          result[prop] = styling[prop][screenSizeIndex];
        }
      }
    }
  }
  private inputIsValid() : boolean {
    let type: string = this.inputChart.type;
    let validTypes: string[] = this.validTypes;

    try {
      this.checkChartType(type, validTypes);
      return true;
    }
    catch (error) {
      console.log('Error: ', error.message, '\n', error.stack);
      return false;
    }
  }
  private isObject(entity: any) : boolean {
    return Object.prototype.toString.call(entity) === '[object Object]';
  }
  private mergeChartStylings (
    inputStyling: Object,
    defaultStyling: iStylingChart
  ) : iStylingChart {
    let result: Object = {};
    this.mergeChartStylings_recursivePart(inputStyling, defaultStyling, result);
    return (<iStylingChart>result);
  }
  private mergeChartStylings_recursivePart(
    inputStyling: Object,
    defaultStyling: iStylingChart,
    result: Object
  ) : void {
    for (let prop in defaultStyling) {
      if (inputStyling[prop]) {
        if (this.isObject(defaultStyling[prop])) {
          result[prop] = {};
          this.mergeChartStylings_recursivePart(
            inputStyling[prop],
            defaultStyling[prop],
            result[prop]
          )
        }
        else {
          result[prop] = inputStyling[prop];
        }
      }
      else {
        result[prop] = defaultStyling[prop];
      }
    }
  }
  private processInputChartStyling() : iStylingChart {
    let chartType: string = this.inputChart.type;
    let defaultStylings: iDefaultChartStylings = this.defaultChartStylings;
    let inputStyling: Object = this.inputChartStyling;

    let defaultStyling: iStylingChart;
    switch(chartType) {
      case 'Bar':
        defaultStyling = defaultStylings.barStyling;
        break;
      case 'Donut':
        defaultStyling = defaultStylings.donutStyling;
        break;
      case 'Line':
        defaultStyling = defaultStylings.lineStyling;
        break;
      case 'Pie':
        defaultStyling = defaultStylings.pieStyling;
        break;
    }
    let mergedStyling: iStylingChart = this.mergeChartStylings(
      inputStyling,
      defaultStyling
    );
    return this.getChartStylingForCurrentScreenSize(mergedStyling);
  }
  private setChartStyling() : void {
    this.chartStyling = this.processInputChartStyling();
  }
  private setChartContainerId() : void {
    if (!window['alep-ng2-chart']) {
      window['alep-ng2-chart'] = {};
      if (!window['alep-ng2-chart']['nextChartContainerId']) {
        window['alep-ng2-chart']['nextChartContainerId'] = 1;
      }
    }
    let containerId: number =
        window['alep-ng2-chart']['nextChartContainerId'] ++;
    this.chartContainerId = containerId;
  }
  private updateChart() : void {
    this.destroyCanvas();
    this.setChartStyling();
    this.createChart();
  }
}
