import {
  Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy,
  OnInit, ViewChild
} from '@angular/core'

import { Subscription } from 'rxjs/Rx';

// import { iChart } from '../../models/iChart'
import { iChart } from './iChart'
import { iChartColl } from "./iChartColl";
import { iStylingObject } from './iStylingObject'

declare var d3: any;

interface iCollection {
  hScale: any,
  labels: string[],
  name: string;
  values: number[],
  vScale: any
}

@Component({
  selector: 'alep-ng2-chart-d3',
  templateUrl: 'alep-ng2-chart_d3.component.html',
  styleUrls: ['alep-ng2-chart_d3.component.css']
})
export class AlepNg2ChartD3Component implements OnDestroy, OnInit {
  @HostListener('window:resize', ['$event'])
  private onResize(event: any) {
    this.emOnResize.emit();
  }
  @Input() private emUpdateChart: EventEmitter<any>;
  @Input() private legendCssClass: string;
  @Input() private titleCssClass: string;
  @Input() private subtitleCssClass: string;
  @Input() private inputChartObject: iChart;
  @Input() private inputStyling: Object = {};
  @ViewChild(
      'alepNg2ChartContainer'
  ) private alepNg2ChartContainerChild: ElementRef;
  @ViewChild(
    'alepNg2ChartLegend'
  ) private alepNg2ChartLegendChild: ElementRef;
  private canvasSelection: any;
  private chartContainerId: number;
  private defaultStyling: iStylingObject = {
    aspectRatio: [1, 1, 2],
    backgroundColor: ['white'],
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
        marginTop: [10]
      },
      stroke: ['black'],
      strokeWidth: [2],
      ticks: {
        labelsAngle: ['-30'],
        opacity: [1],
        stroke: ['black'],
        strokeWidth: [1]
      }
    },
    largeScreenSize: 767,
    marginTop: [30],
    mediumScreenSize: 375,
    plotArea: {
      marginRight: [30],
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
      strokeOpacity: [1],
      strokeWidthDeselected: [3],
      strokeWidthSelected: [5],
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
        fontWeight: ['normal'],
        marginLeft: [10]
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
  };
  private emOnResize: EventEmitter<any> = new EventEmitter();
  private finalStyling: iStylingObject;
  private hasValidInput: boolean = true;
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
    if (this.emUpdateChart) {
     this.subUpdateChart = this.emUpdateChart.subscribe(
       () => this.updateChart()
     );
    }
    this.emOnResize.subscribe(() => this.updateChart());
    this.setChartContainerId();
    this.buildChart();
  }
  ngOnDestroy() {
    this.cancelSubs();
    this.destroyComponentElements();
  }

  private buildChart() : void {
    try {
      this.checkInputValidity(this.inputChartObject.type, this.validTypes);
    }
    catch (error) {
      this.hasValidInput = false;
      console.log('Error: ', error.message, '\n', error.stack);
    }
    if (this.hasValidInput === true) {
      this.prepareContainer(this.chartContainerId);
      this.setFinalStyling(this.inputStyling, this.defaultStyling);
      this.responsiveStyling(this.finalStyling);
      this.createChart(this.inputChartObject, this.finalStyling);
    }
  }
  private cancelSubs() : void {
    this.subUpdateChart.unsubscribe();
  }
  private checkInputValidity(chartType: string, validTypes: string[]) : void {
    let typeIndex: number = validTypes.indexOf(chartType);
    if (typeIndex === -1) {
      throw new Error(`Chart type '${chartType}' is not a valid type.`);
    }
  }
  private createChart(
      chartObject: iChart,
      styling: iStylingObject
  ) : void {
    let screenSizeIndex: number = this.getScreenSizeIndex(styling);
    let aspectRatio: number = styling.aspectRatio[screenSizeIndex];
    let containerWidth: number =
      this.alepNg2ChartContainerChild.nativeElement.offsetWidth;
    let containerHeight: number =
      (containerWidth / aspectRatio) * (1 + 0.05 * screenSizeIndex) +
      styling.hAxis.label.fontSize[screenSizeIndex] +
      styling.hAxis.label.marginTop[screenSizeIndex];
    let tooltipSelection: any = d3.select(`body`)
      .append('div')
      .attr('class', 'alep-ng2-chart-tooltip')
      .style({
        'background': '#1a1a1a',
        'border': '0px',
        'border-radius': '8px',
        'color': 'white',
        'font': '12px sans-serif',
        'left': '0px',
        'opacity': 0,
        'padding': '5px',
        'top': '0px',
        'position': 'absolute'
      });
    tooltipSelection[0][0].setAttribute(
      'tooltip-id', this.chartContainerId
    );
    this.canvasSelection = d3.select(
      `.alep-ng2-chart-container[container-id="${this.chartContainerId}"`
    )
      .append('svg')
      .attr('class', 'canvas')
      .style('height', containerHeight)
      .style('width', containerWidth);
    let backgroundSelection: any = this.canvasSelection
      .append('rect')
      .attr('class', 'background')
      .style('fill', styling.backgroundColor[screenSizeIndex])
      .style('height', containerHeight)
      .style('width', containerWidth);
    let chartSelection: any = this.canvasSelection
      .append('g')
      .attr('class', 'chart')
      .attr('transform', `translate(0 ${styling.marginTop[screenSizeIndex]})`);
    /*
     Collections and scales
     */
    let plotAreaMarginRight: number =
      styling.plotArea.marginRight[screenSizeIndex];
    let plotAreaMarginLeft: number =
      styling.vAxis.label.marginLeft[screenSizeIndex] +
      styling.vAxis.label.fontSize[screenSizeIndex] +
      styling.vAxis.marginLeft[screenSizeIndex] +
      styling.vAxis.fontSize[screenSizeIndex] * 2;
    let plotAreaWidth: number =
      containerWidth -
      plotAreaMarginLeft -
      plotAreaMarginRight;
    let plotAreaHeight: number = plotAreaWidth / aspectRatio;
    let collections: iCollection[] = [];
    let maxDataPointsLength: number = 0;
    let maxVal: number = 0;
    let minVal: number = 0;
    for (let i = 0; i < chartObject.collections.length; i++) {
      let dataPoints: any = chartObject.collections[i].dataSet.dataPoints;
      let name: string = chartObject.collections[i].label;
      let labels: string[] = [];
      let values: number[] = [];
      let dataPointsLength: number = 0;
      for (let label in dataPoints) {
        dataPointsLength ++;
        maxVal = (dataPoints[label] > maxVal) ?
          dataPoints[label] :
          maxVal;
        minVal = (dataPoints[label] < minVal) ?
          dataPoints[label] :
          minVal;
        labels.push(label);
        values.push(dataPoints[label]);
      }
      maxDataPointsLength = (dataPointsLength > maxDataPointsLength) ?
        dataPointsLength :
        maxDataPointsLength;
      collections.push(
        {
          hScale: null,
          labels: labels,
          name: name,
          values: values,
          vScale: null
        }
      );
    }
    let hScale: any = d3.scale.linear()
      .domain([0, maxDataPointsLength - 1])
      .range([0, plotAreaWidth]);
    let vScale: any = d3.scale.linear()
      .domain([minVal, maxVal])
      .range([plotAreaHeight, 0]);
    for (let collection of collections) {
      collection.hScale = hScale;
      collection.vScale = vScale;
    }
    /*
     Vertical axis
     */
    this.createVertAxis(
      styling, chartSelection, vScale, plotAreaWidth, screenSizeIndex
    );
    /*
     Vertical axis label
     */
    this.createVertAxisLabel(
      chartObject, chartSelection, styling, screenSizeIndex
    );
    /*
     Horizontal axis
     */
    this.createHorAxis(
      styling,
      chartSelection,
      hScale,
      collections[0].labels,
      plotAreaHeight,
      screenSizeIndex
    );
    /*
     Horizontal axis label
     */
    this.createHorAxisLabel(
      chartObject,
      chartSelection,
      plotAreaWidth,
      plotAreaMarginLeft,
      styling,
      screenSizeIndex
    );
    /*
     Plot Area
     */
    this.createPlotArea(
      collections,
      chartSelection,
      plotAreaMarginLeft,
      styling,
      tooltipSelection,
      screenSizeIndex
    );
    /*
     Legend
     */
    this.createLegend(plotAreaMarginLeft, styling, screenSizeIndex);
  }
  private createHorAxis(
    styling: iStylingObject,
    chartSelection: any,
    hScale: any,
    labels: string[],
    plotAreaHeight: number,
    screenSizeIndex: number
  ) : void {
    let hAxis: any = d3.svg.axis()
      .scale(hScale)
      .ticks(labels.length)
      .orient('bottom');
    let x: number =
      styling.vAxis.label.marginLeft[screenSizeIndex] +
      styling.vAxis.label.fontSize[screenSizeIndex] +
      styling.vAxis.marginLeft[screenSizeIndex] +
      styling.vAxis.fontSize[screenSizeIndex] * 2;
    let hAxisSelection: any = chartSelection
      .append('g')
      .attr('class', 'horAxis')
      .append('g')
      .call(hAxis)
      .attr({
        'class': 'axis',
        'transform': `translate(${x} ${plotAreaHeight})`
      });
    // Create tick labels
    let fontSize: number = styling.vAxis.fontSize[screenSizeIndex];
    let labelsAngle: string = styling.hAxis.ticks.labelsAngle[screenSizeIndex];
    hAxisSelection.selectAll('.tick text')
      .data(labels)
      .text((d) => {return d})
      .style({
        'font-size': fontSize,
        'text-anchor': 'end'
      })
      .attr('transform', `rotate(${labelsAngle})`);
    // Styling axis
    let stroke: string = styling.hAxis.stroke[screenSizeIndex];
    let strokeWidth: string =
      styling.hAxis.strokeWidth[screenSizeIndex].toString() + 'px';
    hAxisSelection.select('.domain')
      .style({
        'fill': 'none',
        'stroke': stroke,
        'stroke-width': strokeWidth
      });
    // Styling tick lines
    let tickOpacity: number = styling.hAxis.ticks.opacity[screenSizeIndex];
    let tickStroke: string = styling.hAxis.ticks.stroke[screenSizeIndex];
    let tickStrokeWidth: number =
      styling.hAxis.ticks.strokeWidth[screenSizeIndex];
    hAxisSelection.selectAll('.tick line')
      .attr('class', 'tick-line')
      .attr('y2', 6)
      .style({
        'opacity': tickOpacity,
        'stroke': tickStroke,
        'stroke-width': tickStrokeWidth
      });
    // Styling grid lines
    let gridOpacity: number = styling.hAxis.gridLines.opacity[screenSizeIndex];
    let gridStroke: string = styling.hAxis.gridLines.stroke[screenSizeIndex];
    let gridStrokeWidth: number =
      styling.hAxis.gridLines.strokeWidth[screenSizeIndex];
    hAxisSelection.selectAll('.tick')
      .append('line')
      .attr('class', 'grid-line')
      .attr('y2', -plotAreaHeight)
      .style({
        'opacity': gridOpacity,
        'stroke': gridStroke,
        'stroke-width': gridStrokeWidth
      });
  }
  private createHorAxisLabel(
    chartObject: iChart,
    chartSelection: any,
    plotAreaWidth: number,
    plotAreaMarginLeft: number,
    styling: iStylingObject,
    screenSizeIndex: number
  ) : void {
    let x: number = plotAreaMarginLeft + plotAreaWidth / 2;
    let y: number = this.alepNg2ChartContainerChild.nativeElement
      .querySelector('.canvas .chart .horAxis .axis')
      .getBBox().height;
    let marginTop: number = styling.hAxis.label.marginTop[screenSizeIndex];
    let fontSize: number = styling.hAxis.label.fontSize[screenSizeIndex];
    let fontWeight: string = styling.hAxis.label.fontWeight[screenSizeIndex];
    let hAxisLabel = chartSelection.select('.horAxis')
      .append('g')
      .attr('class', 'label')
      .append('text')
      .text(chartObject.hAxisLabel)
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
  }
  private createLegend(
    plotAreaMarginLeft: number,
    styling: iStylingObject,
    screenSizeIndex: number
  ) : void {
    let colors: string[] = styling.plotArea.paletteRange[screenSizeIndex];
    let legendElement: HTMLElement =
      this.alepNg2ChartLegendChild.nativeElement;
    let legendContainer: HTMLElement = document.createElement('div');
    legendContainer.classList.add('legend-container');
    legendElement.insertBefore(
      legendContainer,
      legendElement.childNodes[legendElement.childNodes.length - 1]
    );
    let inputCollections: iChartColl[] = this.inputChartObject.collections;
    for (let i = 0; i < inputCollections.length; i++) {
      let colorIndex: number = i % (colors.length - 1);
      let legendEntry: HTMLElement = document.createElement('div');
      legendEntry.classList.add('legend-entry');
      legendEntry.style.paddingLeft = plotAreaMarginLeft.toString() + 'px';
      let entrySymbol: HTMLElement = document.createElement('div');
      entrySymbol.classList.add('symbol');
      entrySymbol.style.backgroundColor = colors[colorIndex];
      entrySymbol.style.cssFloat = 'left';
      entrySymbol.style.height= '15px';
      entrySymbol.style.marginTop= '4px';
      entrySymbol.style.width= '35px';
      let entryText: HTMLElement = document.createElement('div');
      entryText.classList.add('text');
      entryText.innerText = inputCollections[i].label;
      entryText.style.marginBottom = '5px';
      entryText.style.marginLeft = '45px';
      legendEntry.insertBefore(
        entryText,
        legendEntry.childNodes[legendEntry.childNodes.length - 1]
      );
      legendEntry.insertBefore(
        entrySymbol,
        legendEntry.childNodes[legendEntry.childNodes.length - 1]
      );
      legendContainer.insertBefore(
        legendEntry,
        legendContainer.childNodes[legendContainer.childNodes.length - 1]
      );
    }
  }
  private createPlotArea(
    collections: iCollection[],
    chartSelection: any,
    marginLeft: number,
    styling: iStylingObject,
    tooltipSelection: any,
    screenSizeIndex: number
  ) {
    let paletteRange = styling.plotArea.paletteRange[screenSizeIndex];
    let paletteScale: any = d3.scale.ordinal()
      .range(paletteRange);
    let strokeWidth: string =
      styling.plotArea.strokeWidthDeselected[screenSizeIndex]
        .toString() + 'px';
    let strokeWidthSelected: string =
      styling.plotArea.strokeWidthSelected[screenSizeIndex]
        .toString() + 'px';
    let strokeOpacity: number = styling.plotArea.strokeOpacity[screenSizeIndex];
    let plotAreaSelection: any = chartSelection
      .append('g')
      .attr('class', 'plotArea')
      .attr('transform', `translate(${marginLeft} 0)`);
    // Create collections
    let lengthCollections: number = collections.length;
    for (let i = 0; i < lengthCollections; i++) {
      let hScale: any  = collections[i].hScale;
      let vScale: any  = collections[i].vScale;
      let values: number[] = collections[i].values;
      let lineGenerator: any = d3.svg.line()
        .x(function(d, index) {return hScale(index)})
        .y(function(d) { return vScale(d)})
        .interpolate('linear');
      let collection: any = plotAreaSelection
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
          stroke: paletteScale(i + 1),
          'stroke-opacity': strokeOpacity,
          'stroke-width': strokeWidth
        })
        .on('mouseover', function(d) {
          this.style.strokeWidth = strokeWidthSelected
        })
        .on('mouseout', function(d) {
          this.style.strokeWidth = strokeWidth
        });
      /*
       Data points
       */
      let newLine: string = '<br/>';
      let dataPointsSelection: any = collection.selectAll('circle')
        .data(values)
        .enter()
        .append('circle')
        .attr({
          'class': 'dataPoint',
          'cx': function(d, index) {return hScale(index)},
          'cy': function(d) { return vScale(d)},
          'fill': paletteScale(i + 1),
          'r': '4px'
        })
        .on('mouseover', function(d, index) {
          // Increase radius
          this.setAttribute('r', '6px');
          // Show tooltip
          tooltipSelection.html(
            collections[i].name + newLine +
            collections[i].labels[index] + ': ' + d
          );
          // Tooltip
          let width: number = tooltipSelection[0][0].offsetWidth;
          tooltipSelection
            .style('left', function() {
              let plotAreaMarginLeft: number = plotAreaSelection[0][0]
                .getBoundingClientRect().left;
              let plotAreaWidth: number = plotAreaSelection[0][0]
                .getBoundingClientRect().width;
              let result: string =
                (d3.event.pageX - plotAreaMarginLeft) < plotAreaWidth / 2 ?
                d3.event.pageX + 'px' :
                (d3.event.pageX - width) + 'px';
              return result;
            })
            .style('top', (d3.event.pageY - 4 * 12) + 'px');
          tooltipSelection.transition()
            .duration(200)
            .style('opacity', 0.9);
        })
        .on('mouseout', function(d) {
          // Decrease radius
          this.setAttribute('r', '4px');
          // Fade out tooltip
          tooltipSelection.transition()
            .duration(500)
            .style('opacity', 0);
        });
      // If data point is selected, deselect it when user touches on body
      d3.select('body')[0][0]
        .addEventListener('touchstart', function() {
          // Deselect data point if selected
          let length: number = dataPointsSelection[0].length;
          for (let i = 0; i < length; i++) {
            if (dataPointsSelection[0][i].getAttribute('r') === '6px') {
              dataPointsSelection[0][i].setAttribute('r', '4px');
              break;
            }
          }
        });
    }
    // Fade out active tooltip when user touches on body
    d3.select('body')[0][0]
      .addEventListener('touchstart', function() {
        // Fade out tooltip if active
        if (tooltipSelection.style('opacity') === '0.9') {
          tooltipSelection.transition()
            .duration(500)
            .style('opacity', 0);
        }
      });
  }
  private createVertAxis(
    styling: iStylingObject,
    chartSelection: any,
    vScale: any,
    plotAreaWidth: number,
    screenSizeIndex: number
  ) : void {
    let vAxis: any = d3.svg.axis()
      .scale(vScale)
      .orient('left');
    let x: number =
      styling.vAxis.label.marginLeft[screenSizeIndex] +
      styling.vAxis.label.fontSize[screenSizeIndex] +
      styling.vAxis.marginLeft[screenSizeIndex] +
      styling.vAxis.fontSize[screenSizeIndex] * 2;
    let y: number = 0;
    let vAxisSelection: any = chartSelection
      .append('g')
      .attr('class', 'vertAxis')
      .append('g')
      .call(vAxis)
      .attr({
        'class': 'axis',
        'transform': `translate(${x} ${y})`
      });
    // Styling axis
    let stroke: string = styling.vAxis.stroke[screenSizeIndex];
    let strokeWidth: string =
      styling.vAxis.strokeWidth[screenSizeIndex].toString() + 'px';
    vAxisSelection.select('.domain')
      .style({
        'fill': 'none',
        'stroke': stroke,
        'stroke-width': strokeWidth
      });
    // Styling tick lines
    let tickOpacity: number = styling.vAxis.ticks.opacity[screenSizeIndex];
    let tickStroke: string = styling.vAxis.ticks.stroke[screenSizeIndex];
    let tickStrokeWidth: number =
      styling.vAxis.ticks.strokeWidth[screenSizeIndex];
    vAxisSelection.selectAll('.tick line')
      .attr('class', 'tick-line')
      .attr('x2', -6)
      .style({
        'opacity': tickOpacity,
        'stroke': tickStroke,
        'stroke-width': tickStrokeWidth
      });
    // Styling tick labels
    let fontSize: number = styling.vAxis.fontSize[screenSizeIndex];
    vAxisSelection.selectAll('.tick text')
      .style({
        'font-size': fontSize
      });
    // Styling grid lines
    let gridOpacity: number = styling.vAxis.gridLines.opacity[screenSizeIndex];
    let gridStroke: string = styling.vAxis.gridLines.stroke[screenSizeIndex];
    let gridStrokeWidth: number =
      styling.vAxis.gridLines.strokeWidth[screenSizeIndex];
    vAxisSelection.selectAll('.tick')
      .append('line')
      .attr('class', 'grid-line')
      .attr('x2', plotAreaWidth)
      .style({
        'opacity': gridOpacity,
        'stroke': gridStroke,
        'stroke-width': gridStrokeWidth
      });
  }
  private createVertAxisLabel(
    chartObject: iChart,
    chartSelection: any,
    styling: iStylingObject,
    screenSizeIndex: number
  ) : void {
    let height: number = this.alepNg2ChartContainerChild.nativeElement
      .querySelector('.canvas .chart .vertAxis .axis')
      .getBBox().height;
    let marginLeft: number = styling.vAxis.label.marginLeft[screenSizeIndex];
    let fontSize: number = styling.vAxis.label.fontSize[screenSizeIndex];
    let fontWeight: string = styling.vAxis.label.fontWeight[screenSizeIndex];
    let dy: number = 0.75 * fontSize;
    let y: number = height / 2;
    let vAxisLabel = chartSelection.select('.vertAxis')
      .append('g')
      .attr('class', 'label')
      .append('text')
      .text(chartObject.vAxisLabel)
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
  }
  private destroyComponentElements() : void {
    // Destroy chart
    let parentChart: HTMLElement = this.alepNg2ChartContainerChild.nativeElement;
    let childChart: SVGSVGElement = parentChart.getElementsByTagName('svg')[0];
    parentChart.removeChild(childChart);
    // Destroy legend
    let parentLegend: HTMLElement = this.alepNg2ChartLegendChild.nativeElement;
    let childLegend: Element =
      parentLegend.getElementsByClassName('legend-container')[0];
    parentLegend.removeChild(childLegend);
    // Destroy tooltip
    let parentTooltip: HTMLElement = document.querySelector('body');
    let childTooltip: Element =
      parentTooltip.getElementsByClassName('alep-ng2-chart-tooltip')[0];
    parentTooltip.removeChild(childTooltip);

  }
  private getScreenSizeIndex(styling: iStylingObject) : number {
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
  private prepareContainer(chartContainerId: number) : void {
    this.alepNg2ChartContainerChild.nativeElement.setAttribute(
        'container-id', chartContainerId
    );
  }
  private recursiveMergeStyling (
    inputStyling: Object,
    defaultStyling: iStylingObject,
    temp: Object
  ) : void {
    for (let prop in defaultStyling) {
      if (inputStyling[prop]) {
        if (
          Object.prototype
            .toString
            .call(defaultStyling[prop]) === '[object Object]'
        ) {
          temp[prop] = {};
          this.recursiveMergeStyling(
            inputStyling[prop],
            defaultStyling[prop],
            temp[prop]
          )
        }
        else {
          temp[prop] = inputStyling[prop];
        }
      }
      else {
        temp[prop] = defaultStyling[prop];
      }
    }
  }
  private responsiveStyling(styling: iStylingObject) : void {
    for (let prop in styling) {
      if (
        Object.prototype
          .toString
          .call(styling[prop]) === '[object Object]'
      ) {
        this.responsiveStyling(styling[prop]);
      }
      else {
        if (styling[prop].length === 1) {
          styling[prop].push(styling[prop][0]);
          styling[prop].push(styling[prop][0]);
        }
        else if (styling[prop].length === 2) {
          styling[prop].push(styling[prop][1]);
        }
      }
    }
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
  private setFinalStyling(
    inputStyling: Object,
    defaultStyling: iStylingObject
  ) : void {
    let temp: Object = {};
    this.recursiveMergeStyling(inputStyling, defaultStyling, temp);
    this.finalStyling = (<iStylingObject>temp);
  }
  private updateChart() : void {
    this.destroyComponentElements();
    this.buildChart();
  }
}
