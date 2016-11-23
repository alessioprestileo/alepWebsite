import {
  Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy,
  OnInit, ViewChild
} from '@angular/core';

import { Subscription } from 'rxjs/Rx';

// import { iAlepNg2InputChart } from '../../models/iAlepNg2InputChart'
import { iAlepNg2InputChart } from './iAlepNg2InputChart';
import {iAlepNg2InputChartColl} from "./iAlepNg2InputChartColl";
import { iChartStyling } from './iChartStyling';

declare var d3: any;

class Chart {
  private canvas: Canvas;
  private d3SelectionBackground: any;
  private subtitle: any;
  private title: any;
  private visualization: Visualization;

  constructor(
    parentD3SelectionChartContainer: any,
    inputChart: iAlepNg2InputChart,
    styling: iChartStyling,
    screenSizeIndex: number
  ) {
    this.canvas = new Canvas(parentD3SelectionChartContainer);
    this.d3SelectionBackground = this.createD3SelectionBackground(
      this.canvas,
      styling,
      screenSizeIndex
    );
    this.title = new Title(
      this.canvas,
      inputChart.title,
      styling,
      screenSizeIndex
    );
    this.subtitle = new Subtitle(
      this.canvas,
      this.title,
      inputChart.subtitle,
      styling,
      screenSizeIndex
    );
    this.visualization = new Visualization(
      this.canvas,
      this.subtitle,
      inputChart,
      styling,
      screenSizeIndex
    );

  }

  private adjustHeight(
    styling: iChartStyling,
    screenSizeIndex: number
  ) : void {
    let titleHeight: number = this.title.d3Selection.getBBox().height;
    let subtitleHeight: number = this.subtitle.d3Selection.getBBox().height;
    let chartBodyHeight: number = this.visualization.ch


    let height: number =
      styling.title.marginTop +

    canvasSelection.style('height', canvasHeight);
    backgroundSelection.style('height', canvasHeight);
  }
  private createD3SelectionBackground(
    parentCanvas: Canvas,
    styling: iChartStyling,
    screenSizeIndex: number
  ) : any {
    let d3SelectionBackground: any = parentCanvas.d3Selection
      .append('rect')
      .attr('class', 'background')
      .style('fill', styling.backgroundColor[screenSizeIndex])
      .style('width', parentCanvas.getWidth());
    return d3SelectionBackground;
  }
}
class Canvas {
  public d3Selection: any;

  constructor(parentD3SelectionChartContainer: any) {
    this.d3Selection = this.createD3Selection(parentD3SelectionChartContainer);
  }

  private createD3Selection(parentD3SelectionChartContainer: any) : any {
    let canvasWidth: number = parentD3SelectionChartContainer[0][0]
      .getBBox().width;
    let d3Selection = parentD3SelectionChartContainer
      .append('svg')
      .attr('class', 'canvas')
      .style('height', window.innerHeight)
      .style('width', canvasWidth);
    // Get correct value for canvasWidth. For some reason the correct value
    // is given only after appending the canvas, and only if the height of the
    // canvas is a large enough value.
    canvasWidth = parentD3SelectionChartContainer[0][0].getBBox().width;
    // Update canvas width
    d3Selection.style('width', canvasWidth);
    return d3Selection;
  }
  public getWidth() : number {
    return this.d3Selection[0][0].getBBox().width;
  }
}
abstract class ChartBody {
  public collections: iCollection[];
  public d3Selection: any;
  public hPos: number;
  public plotArea: any;
  public vPos: number;
  public width: number;

  constructor(
    parentCanvas: Canvas,
    subtitle: Subtitle,
    inputChart: iAlepNg2InputChart,
    styling: iChartStyling,
    screenSizeIndex: number
  ) {
    this.setDimensions(
      parentCanvas,
      subtitle,
      styling,
      screenSizeIndex
    );
    this.plotArea = PlotAreaFactory.createPlotArea(
      inputChart.type,
      this,
      styling,
      screenSizeIndex
    );
  }

  protected createD3Selection(
    parentCanvas: Canvas,
    hPos: number,
    vPos: number
  ) : any {
    let d3Selection: any = parentCanvas.d3Selection
      .append('g')
      .attr('class', 'chart-body')
      .attr(
        'transform',
        `translate(${hPos} ${vPos})`);
    return d3Selection;
  }
  private setDimensions(
    parentCanvas: Canvas,
    subtitle: Subtitle,
    styling: iChartStyling,
    screenSizeIndex: number
  ) : void {
    this.width =
      parentCanvas.getWidth() -
      styling.chartBody.marginLeft[screenSizeIndex] -
      styling.chartBody.marginRight[screenSizeIndex];
    this.vPos =
      subtitle.vPos +
      subtitle.d3Selection[0][0].getBBox().height +
      styling.chartBody.marginTop[screenSizeIndex];
    this.hPos =
      styling.chartBody.marginLeft[screenSizeIndex];
  }
}
abstract class ChartBodyFactory {
  public static createChartBody (
    parentCanvas: Canvas,
    subtitle: Subtitle,
    inputChart: iAlepNg2InputChart,
    styling: iChartStyling,
    screenSizeIndex: number
  ) : any {
    let chartType: string = inputChart.type;
    switch(chartType) {
      case 'Bar':
        return new ChartBodyOrthogonal(
          parentCanvas,
          subtitle,
          inputChart,
          styling,
          screenSizeIndex
        );
      case 'Donut':
        return new ChartBodyCircular(
          parentCanvas,
          subtitle,
          inputChart,
          styling,
          screenSizeIndex
        );
      case 'Line':
        return new ChartBodyOrthogonal(
          parentCanvas,
          subtitle,
          inputChart,
          styling,
          screenSizeIndex
        );
      case 'Pie':
        return new ChartBodyCircular(
          parentCanvas,
          subtitle,
          inputChart,
          styling,
          screenSizeIndex
        );
    }
  }
}
class ChartBodyOrthogonal extends ChartBody {
  public hAxis: any;
  public vAxisLeft: any;
  public vAxisRight: any = null;

  constructor(
    parentCanvas: Canvas,
    subtitle: Subtitle,
    inputChart: iAlepNg2InputChart,
    styling: iChartStyling,
    screenSizeIndex: number
  ) {
    super(
      parentCanvas,
      subtitle,
      inputChart,
      styling,
      screenSizeIndex
    );
    this.d3Selection = this.createD3Selection(
      parentCanvas,
      this.hPos,
      this.vPos
    );
    this.collections = this.getCollectionsFromSrc(inputChart.collections);
    this.vAxisLeft = new VAxis(
      this,
      inputChart.vAxisLabel,
      this.getCollectionsMinVal(this.collections),
      this.getCollectionsMaxVal(this.collections),
      styling,
      screenSizeIndex
    );
    this.hAxis = HAxisFactory.createHAxis(
      inputChart.type,
      this,
      inputChart.hAxisLabel,
      0,
      this.collections[0].labels.length,
      styling,
      screenSizeIndex
    );
    this.plotArea.drawData();
  }

  private getCollectionsFromSrc(
    collectionsSrc: iAlepNg2InputChartColl[]
  ) : iCollection[] {
    let collections: iCollection[] = [];
    let maxVal: number = 0;
    let minVal: number = 0;
    for (let i = 0; i < collectionsSrc.length; i++) {
      let dataPoints: any = collectionsSrc[i].dataSet.dataPoints;
      let name: string = collectionsSrc[i].label;
      let labels: string[] = [];
      let values: number[] = [];
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
  private getCollectionsMaxVal(collections: iCollection[]) : number {
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
  private getCollectionsMinVal(collections: iCollection[]) : number {
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
}
class ChartBodyCircular extends ChartBody {
  private innerRadius: number;
  private outerRadius: number;

  constructor(
    parentCanvas: Canvas,
    subtitle: Subtitle,
    inputChart: iAlepNg2InputChart,
    styling: iChartStyling,
    screenSizeIndex: number
  ) {
    super(
      parentCanvas,
      subtitle,
      inputChart,
      styling,
      screenSizeIndex
    );
    this.adjustDimensions(
      styling,
      screenSizeIndex
    );
    this.createD3Selection(
      parentCanvas,
      this.hPos,
      this.vPos
    );
  }

  private adjustDimensions(
    styling: iChartStyling,
    screenSizeIndex: number
  ) : void {
    this.outerRadius = styling.chartBody.plotArea.slice.outerRadius ?
      styling.chartBody.plotArea.slice.outerRadius[screenSizeIndex] :
    this.width / 2;
    this.vPos += this.outerRadius;
    this.hPos += this.outerRadius;
  }
}
abstract class HAxis {
  public d3SelectionAxis: any;
  public d3SelectionAxisGroup: any;
  public d3SelectionLabel: any;
  public d3Scale: any;
  public height: number;
  public hPos: number;
  public vPos: number;

  constructor(
    chartBody: ChartBodyOrthogonal,
    minVal: number,
    maxVal: number,
  ) {
    this.setPosition(
      chartBody.plotArea.dimensions.hPos,
      chartBody.plotArea.dimensions.height,
    );
    this.d3SelectionAxisGroup = this.createD3SelectionAxisGroup(
      chartBody,
      this.hPos,
      this.vPos
    );
    this.d3Scale = this.createD3Scale(
      minVal,
      maxVal,
      0,
      chartBody.plotArea.dimensions.width
    );
  }

  protected appendAxis(
    d3SelectionAxisGroup: any,
    plotAreaHeight: number,
    d3Scale: any,
    labels: string[],
    styling: iChartStyling,
    screenSizeIndex: number
  ) : any {
    let hAxis: any = d3.svg.axis()
      .scale(d3Scale)
      .ticks(labels.length)
      .orient('bottom');
    let d3SelectionAxis: any = d3SelectionAxisGroup
      .append('g')
      .call(hAxis)
      .attr('class', 'axis');
    // Create tick labels
    let fontSize: number = styling.chartBody.vAxis.fontSize[screenSizeIndex];
    let labelsAngle: number =
      styling.chartBody.hAxis.ticks.labelsAngle[screenSizeIndex];
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
    let stroke: string = styling.chartBody.hAxis.stroke[screenSizeIndex];
    let strokeWidth: string =
      styling.chartBody.hAxis.strokeWidth[screenSizeIndex].toString() + 'px';
    d3SelectionAxis.select('.domain')
      .style({
        'fill': 'none',
        'stroke': stroke,
        'stroke-width': strokeWidth
      });
    // Styling tick lines
    let tickOpacity: number = styling.chartBody.hAxis
      .ticks
      .opacity[screenSizeIndex];
    let tickStroke: string = styling.chartBody.hAxis
      .ticks
      .stroke[screenSizeIndex];
    let tickStrokeWidth: number =
      styling.chartBody.hAxis.ticks.strokeWidth[screenSizeIndex];
    d3SelectionAxis.selectAll('.tick line')
      .attr('class', 'tick-line')
      .attr('y2', 6)
      .style({
        'opacity': tickOpacity,
        'stroke': tickStroke,
        'stroke-width': tickStrokeWidth
      });
    // Styling grid lines
    let gridOpacity: number = styling.chartBody.hAxis
      .gridLines
      .opacity[screenSizeIndex];
    let gridStroke: string = styling.chartBody.hAxis
      .gridLines
      .stroke[screenSizeIndex];
    let gridStrokeWidth: number =
      styling.chartBody.hAxis.gridLines.strokeWidth[screenSizeIndex];
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
  protected appendLabel(
    d3SelectionAxisGroup: any,
    axisGroupHeight: number,
    plotAreaWidth: number,
    text: string,
    styling: iChartStyling,
    screenSizeIndex: number
  ) : any {
    let marginTop: number = styling.chartBody.hAxis
      .label
      .marginTop[screenSizeIndex];
    let fontSize: number = styling.chartBody.hAxis
      .label
      .fontSize[screenSizeIndex];
    let fontWeight: string = styling.chartBody.hAxis
      .label
      .fontWeight[screenSizeIndex];
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
  private createD3SelectionAxisGroup(
    chartBody: ChartBodyOrthogonal,
    hPos: number,
    vPos: number
  ) : any {
    let hAxisGroupSelection: any = chartBody.d3Selection
      .append('g')
      .attr('class', 'horAxis')
      .attr('transform', `translate(${hPos} ${vPos})`);
    return hAxisGroupSelection;
  }
  protected createD3Scale(
    domainMin: number,
    domainMax: number,
    rangeMin: number,
    rangeMax: number
  ) : any {
    let hScale: any = d3.scale.linear()
      .domain([domainMin, domainMax])
      .range([rangeMin, rangeMax]);
    return hScale;
  }
  public getHeight() : number {
    return this.d3SelectionAxisGroup[0][0].getBBox().height;
  }
  private setPosition(hPos: number, vPos: number) : void {
    this.hPos = hPos;
    this.vPos = vPos;
  }
}
class HAxisBar extends HAxis {
  constructor(
    chartBody: ChartBodyOrthogonal,
    labelText: string,
    minVal: number,
    maxVal: number,
    styling: iChartStyling,
    screenSizeIndex: number
  ) {
    super(
      chartBody,
      minVal,
      maxVal
    );
    this.d3SelectionAxis = this.appendAxis(
      this.d3SelectionAxisGroup,
      chartBody.plotArea.dimensions.height,
      this.d3Scale,
      chartBody.collections[0].labels,
      styling,
      screenSizeIndex
    );
    this.adjustTickLabelsPosition(
      this.d3SelectionAxis.selectAll('.tick text'),
      chartBody.collections[0].labels,
      chartBody.plotArea.dimensions.width,
      styling,
      screenSizeIndex
    );
    this.d3SelectionLabel = this.appendLabel(
      this.d3SelectionAxisGroup,
      this.d3SelectionAxisGroup[0][0].getBBox().height,
      chartBody.plotArea.dimensions.width,
      labelText,
      styling,
      screenSizeIndex
    );
  }
  private adjustTickLabelsPosition(
    d3SelectionTickLabels: any,
    labels: string[],
    plotAreaWidth: number,
    styling: iChartStyling,
    screenSizeIndex: number
  ) : void {
    let totDataPoints: number = labels.length;
    let dataGroupWidth: number = plotAreaWidth / totDataPoints;
    let labelsHorShift: number = dataGroupWidth / 2;
    let fontSize: number = styling.chartBody.vAxis.fontSize[screenSizeIndex];
    let labelsAngle: number = styling.chartBody.hAxis
      .ticks
      .labelsAngle[screenSizeIndex];
    d3SelectionTickLabels.attr(
      'transform',
      `translate(${labelsHorShift} ${fontSize}) rotate(${labelsAngle})`
    );
  }
}
abstract class HAxisFactory {
  public static createHAxis(
    chartType: string,
    chartBody: ChartBodyOrthogonal,
    labelText: string,
    minVal: number,
    maxVal: number,
    styling: iChartStyling,
    screenSizeIndex: number
  ) : any {
    switch(chartType) {
      case 'Bar':
        return new HAxisBar(
          chartBody,
          labelText,
          minVal,
          maxVal + 1,
          styling,
          screenSizeIndex
        );
      case 'Line':
        return new HAxisLine(
          chartBody,
          labelText,
          minVal,
          maxVal,
          styling,
          screenSizeIndex
        );
    }
  }
}
class HAxisLine extends HAxis {
  constructor(
    chartBody: ChartBodyOrthogonal,
    labelText: string,
    minVal: number,
    maxVal: number,
    styling: iChartStyling,
    screenSizeIndex: number
  ) {
    super(
      chartBody,
      minVal,
      maxVal
    );
    this.d3SelectionAxis = this.appendAxis(
      this.d3SelectionAxisGroup,
      chartBody.plotArea.dimensions.height,
      this.d3Scale,
      chartBody.collections[0].labels,
      styling,
      screenSizeIndex
    );
    this.d3SelectionLabel = this.appendLabel(
      this.d3SelectionAxisGroup,
      this.d3SelectionAxisGroup[0][0].getBBox().height,
      chartBody.plotArea.dimensions.width,
      labelText,
      styling,
      screenSizeIndex
    );
  }
}
abstract class Legend {
  public d3Selection: any;

  constructor(
    parentCanvas: Canvas,
    hPos: number,
    vPos: number
  ) {
    this.d3Selection = this.createD3Selection(
      parentCanvas,
      hPos,
      vPos
    );
  }

  private createD3Selection(
    parentCanvas: Canvas,
    hPos: number,
    vPos: number
  ) : any {
    let d3Selection: any = parentCanvas.d3Selection
      .append('g')
      .attr('class', 'chart-legend')
      .attr('transform', `translate(${hPos} ${vPos})`);
    return d3Selection;
  }

  protected abstract getEntryLabels(collections: iCollection[]) : string[];
  protected createEntries(
    labels: string[],
    d3ScalePalette: any,
    styling: iChartStyling,
    screenSizeIndex: number
  ) : void {
    let d3SelectionLegendGroup: any = this.d3Selection;

    for (let i = 0; i < labels.length; i++) {
      let marginTop: number = styling.legend.marginTop[screenSizeIndex];
      let fontSize: number = styling.legend.legendEntry
        .text
        .fontSize[screenSizeIndex];
      let textMarginLeft: number = styling.legend.legendEntry
        .text
        .marginLeft[screenSizeIndex];
      let symbolHeight: number = styling.legend.legendEntry
        .symbol
        .height[screenSizeIndex];
      let symbolWidth: number = styling.legend.legendEntry
        .symbol
        .width[screenSizeIndex];
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

}
class LegendCircular extends Legend {
  constructor(
    parentCanvas: Canvas,
    hPos: number,
    vPos: number,
    collections: iCollection[],
    d3ScalePalette: any,
    styling: iChartStyling,
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
    styling: iChartStyling,
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
    styling: iChartStyling,
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
abstract class PlotArea {
  public d3ScalePalette: any;
  public d3Selection: any;
  public dimensions: iPlotAreaDimensions;

  constructor(
    chartBody: ChartBody,
    styling: iChartStyling,
    screenSizeIndex: number
  ) {
    this.setDimensions(
      chartBody.width,
      styling,
      screenSizeIndex
    );
  }

  protected createD3ScalePalette(
    domainLength: number,
    range: string[]
  ) : any {
    let domain: number[] = [];
    for (let i = 0; i < domainLength; i++) {
      domain.push(i);
    }
    let d3ScalePalette: any = d3.scale.ordinal()
      .domain(domain)
      .range(range);
    return d3ScalePalette;
  }
  protected createD3Selection(
    d3SelectionChartBody: any,
    hPos: number
  ) : any {
    let d3Selection: any = d3SelectionChartBody
      .append('g')
      .attr('class', 'plotArea')
      .attr('transform', `translate(${hPos} 0)`);
    return d3Selection;
  }
  public abstract drawData(
    chartType: string,
    d3SelectionPlotArea: any,
    d3ScalePalette: any,
    collections: iCollection[],
    plotAreaDimensions: iPlotAreaDimensions,
    hScale: any,
    vScale: any,
    tooltip: any,
    styling: iChartStyling,
    screenSizeIndex: number
  ) : void;
  private setDimensions(
    chartBodyWidth: number,
    styling: iChartStyling,
    screenSizeIndex: number
  ) : void {
    let aspectRatio: number = styling.aspectRatio[screenSizeIndex];
    let height: number = chartBodyWidth / aspectRatio;
    this.dimensions = {
      aspectRatio: aspectRatio,
      height: height,
      hPos: 0,
      width: chartBodyWidth
    };
  }
}
abstract class PlotAreaCircular extends PlotArea {
  protected innerRadius: number;
  protected outerRadius: number;

  constructor(
    chartBody: ChartBody,
    styling: iChartStyling,
    screenSizeIndex: number
  ) {
    super(
      chartBody,
      styling,
      screenSizeIndex
    );
    this.d3ScalePalette = this.createD3ScalePalette(
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
    plotAreaDimensions: iPlotAreaDimensions,
    hScale: any,
    vScale: any,
    tooltip: any,
    styling: iChartStyling,
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
    styling: iChartStyling,
    screenSizeIndex: number
  ) : void;
}
class PlotAreaDonut extends PlotAreaCircular {
  constructor(
    chartBody: ChartBody,
    styling: iChartStyling,
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
    styling: iChartStyling,
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
    styling: iChartStyling,
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
    styling: iChartStyling,
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
    styling: iChartStyling,
    screenSizeIndex: number
  ) {
    super(
      chartBody,
      styling,
      screenSizeIndex
    );
    this.d3ScalePalette = this.createD3ScalePalette(
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
    styling: iChartStyling,
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
    plotAreaDimensions: iPlotAreaDimensions,
    hScale: any,
    vScale: any,
    tooltip: any,
    styling: iChartStyling,
    screenSizeIndex: number
  ) : void;
}
class PlotAreaBar extends PlotAreaOrthogonal {
  constructor(
    chartBody: ChartBody,
    styling: iChartStyling,
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
    plotAreaDimensions: iPlotAreaDimensions,
    hScale: any,
    vScale: any,
    tooltip: any,
    styling: iChartStyling,
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
    styling: iChartStyling,
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
    styling: iChartStyling,
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
    plotAreaDimensions: iPlotAreaDimensions,
    hScale: any,
    vScale: any,
    tooltip: any,
    styling: iChartStyling,
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
abstract class WrappableD3TextElement {
  constructor() {}

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
  public d3Selection: any;
  public text: string;
  public vPos: number;
  public width: number;

  constructor(
    parentCanvas: Canvas,
    title: Title,
    text: string,
    styling: iChartStyling,
    screenSizeIndex: number
  ) {
    super();
    this.text = text;
    this.vPos =
      title.d3Selection[0][0].getBBox().height +
      title.vPos +
      styling.subtitle.marginTop[screenSizeIndex];
    this.width = parentCanvas.getWidth();
    this.d3Selection = this.create(
      parentCanvas,
      this.vPos,
      this.width,
      this.text,
      styling,
      screenSizeIndex
    );
  }

  private create(
    parentCanvas: Canvas,
    vPos: number,
    width: number,
    text: string,
    styling: iChartStyling,
    screenSizeIndex: number
  ) : any {
    let d3Selection: any = parentCanvas.d3Selection.append('text')
      .text(text)
      .attr('class', 'chart-subtitle')
      .attr({
        'transform': `translate(0 ${vPos})`,
        'x': width / 2,
        'y': styling.subtitle.fontSize[screenSizeIndex]
      })
      .style({
        'font-size': styling.subtitle.fontSize[screenSizeIndex] + 'px',
        'font-weight': styling.subtitle.fontWeight[screenSizeIndex],
        'text-anchor': 'middle'
      });
    this.wrap(this.d3Selection, width);
    return d3Selection;
  }
}
class Title extends WrappableD3TextElement {
  public d3Selection: any;
  public text: string;
  public vPos: number;
  public width: number;

  constructor(
    parentCanvas: Canvas,
    text: string,
    styling: iChartStyling,
    screenSizeIndex: number
  ) {
    super();
    this.text = text;
    this.vPos = styling.title.marginTop[screenSizeIndex];
    this.width = parentCanvas.getWidth();
    this.d3Selection = this.create(
      parentCanvas,
      this.vPos,
      this.width,
      this.text,
      styling,
      screenSizeIndex
    );
  }

  private create(
    parentCanvas: Canvas,
    vPos: number,
    width: number,
    text: string,
    styling: iChartStyling,
    screenSizeIndex: number
  ) : any {
    let d3Selection: any = parentCanvas.d3Selection.append('text')
      .attr('class', 'chart-title')
      .text(text)
      .attr({
        'transform': `translate(0 ${vPos})`,
        'x': width / 2,
        'y': styling.title.fontSize[screenSizeIndex]
      })
      .style({
        'font-size': styling.title.fontSize[screenSizeIndex] + 'px',
        'font-weight': styling.title.fontWeight[screenSizeIndex],
        'text-anchor': 'middle'
      });
    this.wrap(d3Selection, width);
    return d3Selection;
  }
}
class Tooltip {
  private d3Selection: any;

  constructor(
    parentD3SelectionDocumentBody: any,
    chartContainerId: number,
    styling: iChartStyling,
    screenSizeIndex: number
  ) {
    this.d3Selection = this.createD3Selection(
      parentD3SelectionDocumentBody,
      chartContainerId,
      styling,
      screenSizeIndex
    );
    this.fadeOutOnBodyTouchstart(styling, screenSizeIndex);
  }

  private createD3Selection(
    parentD3SelectionDocumentBody: any,
    chartContainerId: number,
    styling: iChartStyling,
    screenSizeIndex: number
  ) {
    let tooltipSelection: any = parentD3SelectionDocumentBody
      .append('div')
      .attr('class', 'alep-ng2-chart-tooltip')
      .style({
        'background': styling.tooltip.backgroundColor[screenSizeIndex],
        'border-color': styling.tooltip.borderColor[screenSizeIndex],
        'border-radius': styling.tooltip.borderRadius[screenSizeIndex] + 'px',
        'color': styling.tooltip.fontColor[screenSizeIndex],
        'font-size': styling.tooltip.fontSize[screenSizeIndex] + 'px',
        'left': '0px',
        'opacity': 0,
        'padding-bottom': styling.tooltip.paddingBottom[screenSizeIndex] + 'px',
        'padding-left': styling.tooltip.paddingLeft[screenSizeIndex] + 'px',
        'padding-right': styling.tooltip.paddingRight[screenSizeIndex] + 'px',
        'padding-top': styling.tooltip.paddingTop[screenSizeIndex] + 'px',
        'top': '0px',
        'position': 'absolute'
      });
    tooltipSelection[0][0].setAttribute(
      'tooltip-id', chartContainerId
    );
    return tooltipSelection;
  }
  private fadeOutOnBodyTouchstart(
    styling: iChartStyling,
    screenSizeIndex: number
  ) : void {
    let d3Selection: any = this.d3Selection;

    let fadeOutDuration: number = styling.tooltip
      .fadeOutDuration[screenSizeIndex];
    d3.select('body')[0][0]
      .addEventListener('touchstart', function() {
        // Fade out tooltip if active
        if (
          d3Selection.style('opacity') ===
          styling.tooltip.opacity[screenSizeIndex].toString()
        ) {
          d3Selection.transition()
            .duration(fadeOutDuration)
            .style('opacity', 0);
        }
      });
  }
  public hide(
    styling: iChartStyling,
    screenSizeIndex: number
  ) : void {
    let fadeOutDuration: number = styling.tooltip
      .fadeOutDuration[screenSizeIndex];

    this.d3Selection.transition()
      .duration(fadeOutDuration)
      .style('opacity', 0);
  }
  public show(
    d3SelectionPlotArea: any,
    styling: iChartStyling,
    screenSizeIndex: number
  ) : void {
    let d3Selection: any = this.d3Selection;
    let fadeInDuration: number = styling.tooltip.fadeInDuration[screenSizeIndex];

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
        styling.tooltip.opacity[screenSizeIndex]
      );
  }
}
class VAxis {
  public d3SelectionAxis: any;
  public d3SelectionAxisGroup: any;
  public d3SelectionLabel: any;
  public d3Scale: any;
  public height: number;
  public hPos: number;
  public vPos: number;

  constructor(
    chartBody: ChartBodyOrthogonal,
    labelText: string,
    minVal: number,
    maxVal: number,
    styling: iChartStyling,
    screenIndex: number
  ) {
    this.d3SelectionAxisGroup = this.createD3SelectionAxisGroup(chartBody);
    this.d3Scale = this.createD3Scale(
      minVal,
      maxVal,
      0,
      chartBody.plotArea.dimensions.height
    );
    this.d3SelectionAxis = this.appendAxis(
      this.d3SelectionAxisGroup,
      this.d3Scale,
      chartBody.plotArea.dimensions.width,
      styling,
      screenIndex
    );
    this.d3SelectionLabel = this.appendLabel(
      this.d3SelectionAxisGroup,
      chartBody.plotArea.dimensions.height / 2,
      labelText,
      styling,
      screenIndex
    );
  }

  private appendAxis(
    d3SelectionAxisGroup: any,
    d3Scale: any,
    plotAreaWidth: number,
    styling: iChartStyling,
    screenSizeIndex: number
  ) : any {
    let d3Axis: any = d3.svg.axis()
      .scale(d3Scale)
      .orient('left');
    let hPos: number =
      this.hPos +
      styling.chartBody.marginLeft[screenSizeIndex] +
      styling.chartBody.vAxis.label.fontSize[screenSizeIndex] +
      styling.chartBody.vAxis.marginLeft[screenSizeIndex] +
      styling.chartBody.vAxis.fontSize[screenSizeIndex] * 2;
    let d3SelectionAxis: any = d3SelectionAxisGroup
      .append('g')
      .call(d3Axis)
      .attr({
        'class': 'axis',
        'transform': `translate(${this.hPos} ${this.vPos})`
      });
    // Styling axis
    let stroke: string = styling.chartBody.vAxis.stroke[screenSizeIndex];
    let strokeWidth: string =
      styling.chartBody.vAxis.strokeWidth[screenSizeIndex].toString() + 'px';
    d3SelectionAxis.select('.domain')
      .style({
        'fill': 'none',
        'stroke': stroke,
        'stroke-width': strokeWidth
      });
    // Styling tick lines
    let tickOpacity: number = styling.chartBody.vAxis
      .ticks
      .opacity[screenSizeIndex];
    let tickStroke: string = styling.chartBody.vAxis
      .ticks
      .stroke[screenSizeIndex];
    let tickStrokeWidth: number =
      styling.chartBody.vAxis.ticks.strokeWidth[screenSizeIndex];
    d3SelectionAxis.selectAll('.tick line')
      .attr('class', 'tick-line')
      .attr('x2', -6)
      .style({
        'opacity': tickOpacity,
        'stroke': tickStroke,
        'stroke-width': tickStrokeWidth
      });
    // Styling tick labels
    let fontSize: number = styling.chartBody.vAxis.fontSize[screenSizeIndex];
    d3SelectionAxis.selectAll('.tick text')
      .style({
        'font-size': fontSize
      });
    // Styling grid lines
    let gridOpacity: number = styling.chartBody.vAxis
      .gridLines
      .opacity[screenSizeIndex];
    let gridStroke: string = styling.chartBody.vAxis
      .gridLines
      .stroke[screenSizeIndex];
    let gridStrokeWidth: number =
      styling.chartBody.vAxis.gridLines.strokeWidth[screenSizeIndex];
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
  private appendLabel(
    d3SelectionAxisGroup: any,
    vPos: number,
    text: string,
    styling: iChartStyling,
    screenSizeIndex: number
  ) : any {
    let marginLeft: number = styling.chartBody.marginLeft[screenSizeIndex];
    let fontSize: number = styling.chartBody.vAxis
      .label
      .fontSize[screenSizeIndex];
    let fontWeight: string = styling.chartBody.vAxis
      .label
      .fontWeight[screenSizeIndex];
    let dy: number = 0.75 * fontSize;
    let y: number = vPos;
    let vAxisLabel = d3SelectionAxisGroup
      .append('g')
      .attr('class', 'label')
      .append('text')
      .text(text)
      .attr({
        'dy': dy,
        'text-anchor': 'middle',
        'transform': `rotate(-90 ${marginLeft} ${y})`,
        'x': marginLeft,
        'y': y
      })
      .style({
        'font-size': fontSize,
        'font-weight': fontWeight
      });
    return vAxisLabel;
  }
  private createD3Scale(
    domainMin: number,
    domainMax: number,
    rangeMin: number,
    rangeMax: number
  ) : any {
    let vScale: any = d3.scale.linear()
      .domain([domainMin, domainMax])
      .range([rangeMax, rangeMin]);
    return vScale;
  }
  private createD3SelectionAxisGroup(
    chartBody: ChartBodyOrthogonal
  ) : any {
    let d3SelectionAxisGroup: any = chartBody.d3Selection
      .append('g')
      .attr('class', 'vertAxis');
    return d3SelectionAxisGroup;
  }
}
class Visualization {
  private chartBody: any;
  private legend: any;

  constructor(
    canvas: Canvas,
    subtitle: Subtitle,
    inputChart: iAlepNg2InputChart,
    styling: iChartStyling,
    screenSizeIndex: number
  ) {
    this.chartBody = ChartBodyFactory.createChartBody(
      canvas,
      subtitle,
      inputChart,
      styling,
      screenSizeIndex
    );
    this.legend = LegendFactory.createLegend(
      inputChart.type,
      canvas,
      this.getLegendHPos(
        this.chartBody.plotArea.dimensions.hPos,
        styling,
        screenSizeIndex
      ),
      this.getLegendVPos(
        styling,
        screenSizeIndex
      ),
      this.chartBody.collections,
      this.chartBody.d3ScalePalette,
      styling,
      screenSizeIndex
    );
  }

  private getLegendHPos(
    plotAreaHPos: number,
    styling: iChartStyling,
    screenSizeIndex: number
  ) : number {
    return styling.chartBody.marginLeft[screenSizeIndex] +
      plotAreaHPos;
  }
  private getLegendVPos(
    styling: iChartStyling,
    screenSizeIndex: number
  ) : number {
    let chartBodyHeight: number = this.chartBody.d3Selection.getBBox().height;
    return chartBodyHeight +
      styling.legend.marginTop[screenSizeIndex];
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
  barStyling: iChartStyling,
  donutStyling: iChartStyling,
  lineStyling: iChartStyling,
  pieStyling: iChartStyling
}
interface iPlotAreaDimensions {
  aspectRatio: number,
  height: number,
  hPos: number,
  width: number
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
  @Input() private inputStyling: Object = {};
  @ViewChild(
    'alepNg2ChartContainer'
  ) private alepNg2ChartContainerChild: ElementRef;
  private chartContainerId: number;
  private defaultChartStylings: iDefaultChartStylings = {
    barStyling: {
      aspectRatio: [1, 1, 2],
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
      aspectRatio: [1, 1, 1],
      backgroundColor: ['white'],
      chartBody: {
        hAxis: null,
        marginLeft: [10, 20,200],
        marginRight: [10, 20,200],
        marginTop: [30],
        plotArea: {
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
      aspectRatio: [1, 1, 2],
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
      aspectRatio: [1, 1, 1],
      backgroundColor: ['white'],
      chartBody: {
        hAxis: null,
        marginLeft: [10, 20,200],
        marginRight: [10, 20,200],
        marginTop: [30],
        plotArea: {
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
  private finalStyling: iChartStyling;
  private hasValidInput: boolean = true;
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
      this.setFinalStyling();
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
    let styling: iChartStyling = this.finalStyling;

    new Chart(
      d3.select(`.alep-ng2-chart-container[container-id="${chartContainerId}"`),
      inputChart,
      styling,
      this.getScreenSizeIndex(styling)
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
  private getResponsiveStyling(styling: iChartStyling) : iChartStyling {
    let result: Object = {};
    this.getResponsiveStyling_recursivePart(styling, result);
    return (<iChartStyling>result);
  }
  private getResponsiveStyling_recursivePart(
    styling: iChartStyling,
    result: Object
  ) : void {
    for (let prop in styling) {
      if (styling[prop] === null) {
        continue;
      }
      else if (this.isObject(styling[prop])) {
        result[prop] = {};
        this.getResponsiveStyling_recursivePart(styling[prop], result[prop]);
      }
      else {
        if (styling[prop].length === 1) {
          result[prop] = [
            styling[prop][0],
            styling[prop][0],
            styling[prop][0]
          ];
        }
        else if (styling[prop].length === 2) {
          result[prop] = [
            styling[prop][0],
            styling[prop][1],
            styling[prop][1]
          ];
        }
        else if (styling[prop].length === 3) {
          result[prop] = [
            styling[prop][0],
            styling[prop][1],
            styling[prop][2]
          ];
        }
      }
    }
  }
  private getScreenSizeIndex(styling: iChartStyling) : number {
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
  private processInputStyling() : void {
    let chartType: string = this.inputChart.type;
    let defaultChartStylings: iDefaultChartStylings = this.defaultChartStylings;
    let inputStyling: Object = this.inputStyling;

    let defaultStyling: iChartStyling;
    switch(chartType) {
      case 'Bar':
        defaultStyling = defaultChartStylings.barStyling;
        break;
      case 'Donut':
        defaultStyling = defaultChartStylings.donutStyling;
        break;
      case 'Line':
        defaultStyling = defaultChartStylings.lineStyling;
        break;
      case 'Pie':
        defaultStyling = defaultChartStylings.pieStyling;
        break;
    }
    let mergedStyling: iChartStyling = this.mergeStylings(
      inputStyling,
      defaultStyling
    );
    let responsiveStyling: iChartStyling = mergedStyling;
    this.getResponsiveStyling(responsiveStyling);
  }
  private mergeStylings (
    inputStyling: Object,
    defaultStyling: iChartStyling
  ) : iChartStyling {
    let result: Object = {};
    this.mergeStylings_recursivePart(inputStyling, defaultStyling, result);
    return (<iChartStyling>result);
  }
  private mergeStylings_recursivePart(
    inputStyling: Object,
    defaultStyling: iChartStyling,
    result: Object
  ) : void {
    for (let prop in defaultStyling) {
      if (inputStyling[prop]) {
        if (this.isObject(defaultStyling[prop])) {
          result[prop] = {};
          this.mergeStylings_recursivePart(
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
  private getStylingByScreenSize(
    reponsiveStyling: iChartStyling
  ) : iChartStyling {
    let screenSizeIndex: number = this.getScreenSizeIndex()
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
  private setFinalStyling() : void {
    this.processInputStyling();
    this.getResponsiveStyling();
  }
  private updateChart() : void {
    this.destroyCanvas();
    this.createChart();
  }
}
