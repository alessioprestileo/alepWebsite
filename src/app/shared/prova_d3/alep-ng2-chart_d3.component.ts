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
  // @ViewChild(
  //     'alepNg2ChartBody'
  // ) private alepNg2ChartBodyChild: ElementRef;
  @ViewChild(
    'alepNg2ChartContainer'
  ) private alepNg2ChartContainerChild: ElementRef;
  // @ViewChild(
  //   'alepNg2ChartLegend'
  // ) private alepNg2ChartLegendChild: ElementRef;
  private chartContainerId: number;
  private defaultStyling: iStylingObject = {
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
      marginTop: [30],
      plotArea: {
        bar: {
          barGap: [2],
          dataGroupPadding: [6],
          selectionOutline: {
            color: ['grey'],
            opacity: [0.5],
            width: [0]
          }
        },
        dataPoint: {
          diameterDeselected: [4],
          diameterSelected: [6]
        },
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
        path: {
          strokeOpacity: [1],
          strokeWidthDeselected: [3],
          strokeWidthSelected: [5],
        },
        slice: {
        },
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
    },
    largeScreenSize: 767,
    mediumScreenSize: 375,
    title: {
      fontSize: [25],
      paddingBottom: [10],
      paddingTop: [10],
    },
    tooltip: {
      backgroundColor: ['#1a1a1a'],
      border: ['0px'],
      borderRadius: ['8px'],
      fadeInDuration: [200],
      fadeOutDuration: [500],
      font: ['12px sans-serif'],
      fontColor: ['white'],
      opacity: [0.9],
      padding: ['5px']
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
      // this.createChart(
      //   this.alepNg2ChartBodyChild,
      //   this.alepNg2ChartLegendChild,
      //   this.chartContainerId,
      //   this.inputChartObject,
      //   this.finalStyling
      // );
      this.createChart(
        this.alepNg2ChartContainerChild,
        this.chartContainerId,
        this.inputChartObject,
        this.finalStyling
      );
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
    // chartBodyChild: ElementRef,
    // chartLegendChild: ElementRef,
    chartContainerChild: ElementRef,
    chartContainerId: number,
    chartObject: iChart,
    styling: iStylingObject
  ) : void {
    let chartType: string = chartObject.type;
    let screenSizeIndex: number = this.getScreenSizeIndex(styling);
    let aspectRatio: number = styling.aspectRatio[screenSizeIndex];
    // let containerWidth: number = chartBodyChild.nativeElement.offsetWidth;
    let chartBodyWidth: number = chartContainerChild.nativeElement.offsetWidth;
    let chartBodyHeight: number =
      (chartBodyWidth / aspectRatio) * (1 + 0.05 * screenSizeIndex) +
      styling.chartBody.hAxis.label.fontSize[screenSizeIndex] +
      styling.chartBody.hAxis.label.marginTop[screenSizeIndex];
    let tooltipSelection: any = this.getInitializedTooltip(
      styling,
      screenSizeIndex,
      chartContainerId
    );
    let canvasSelection: any = d3.select(
      `.alep-ng2-chart-container[container-id="${chartContainerId}"`
    )
      .append('svg')
      .attr('class', 'canvas')
      .style('height', chartBodyHeight)
      .style('width', chartBodyWidth);
    // For some reason, the command "chartContainerChild.nativeElement.offsetWidth"
    // only gives the correct width after the canvas svg has been appended,
    // hence the values updates in the following lines
    // *************************************************************************
    // containerWidth = chartBodyChild.nativeElement.offsetWidth;
    chartBodyWidth = chartContainerChild.nativeElement.offsetWidth;
    chartBodyHeight =
      (chartBodyWidth / aspectRatio) * (1 + 0.05 * screenSizeIndex) +
      styling.chartBody.hAxis.label.fontSize[screenSizeIndex] +
      styling.chartBody.hAxis.label.marginTop[screenSizeIndex];
    // *************************************************************************
    let backgroundSelection: any = canvasSelection
      .append('rect')
      .attr('class', 'background')
      .style('fill', styling.backgroundColor[screenSizeIndex])
      .style('height', chartBodyHeight)
      .style('width', chartBodyWidth);
    /*
     Chart title
     */
    let chartTitleSelection: any = canvasSelection
      .append('g')
      .attr('class', 'chart-title');
    this.createTitle(
      chartContainerChild.nativeElement.offsetWidth,
      chartTitleSelection,
      chartObject,
      styling,
      screenSizeIndex);
    /*
     Chart subtitle
     */
    let chartSubtitleSelection: any = canvasSelection
      .append('g')
      .attr('class', 'chart-subtitle');
    /*
     Collections and scales
     */
    let collections: iCollection[] = [];
    let plotAreaHeight: number;
    let plotAreaMarginLeft: number;
    let plotAreaWidth: number;
    if ((chartType === 'Bar') ||
        (chartType === 'Line')) {
      let plotAreaMarginRight: number =
        styling.chartBody.plotArea.marginRight[screenSizeIndex];
      plotAreaMarginLeft =
        styling.chartBody.vAxis.label.marginLeft[screenSizeIndex] +
        styling.chartBody.vAxis.label.fontSize[screenSizeIndex] +
        styling.chartBody.vAxis.marginLeft[screenSizeIndex] +
        styling.chartBody.vAxis.fontSize[screenSizeIndex] * 2;
      plotAreaWidth =
        chartBodyWidth -
        plotAreaMarginLeft -
        plotAreaMarginRight;
      plotAreaHeight = plotAreaWidth / aspectRatio;
      let maxVal: number = 0;
      let minVal: number = 0;
      // Fill collections array
      for (let i = 0; i < chartObject.collections.length; i++) {
        let dataPoints: any = chartObject.collections[i].dataSet.dataPoints;
        let name: string = chartObject.collections[i].label;
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
            hScale: null,
            labels: labels,
            name: name,
            values: values,
            vScale: null
          }
        );
      }
      // Create scales
      let hScale: any;
      if (chartType === 'Bar') {
        hScale = d3.scale.linear()
          .domain([0, collections[0].labels.length])
          .range([0, plotAreaWidth]);
      }
      else if (chartType === 'Line') {
        hScale = d3.scale.linear()
          .domain([0, collections[0].labels.length - 1])
          .range([0, plotAreaWidth]);
      }
      let vScale: any = d3.scale.linear()
        .domain([minVal, maxVal])
        .range([plotAreaHeight, 0]);
      for (let collection of collections) {
        collection.hScale = hScale;
        collection.vScale = vScale;
      }
    }
    /*
     Chart body
     */
    let chartBodyVertPos: number =
      styling.title.paddingTop[screenSizeIndex] +
      chartTitleSelection[0][0].getBBox().height +
      styling.title.paddingBottom[screenSizeIndex] +
      styling.chartBody.marginTop[screenSizeIndex];
    let chartBodySelection: any = canvasSelection
      .append('g')
      .attr('class', 'chart-body')
      .attr(
        'transform',
        `translate(0 ${chartBodyVertPos})`);
    /*
     Vertical axis
     */
    this.createVertAxis(
      styling,
      chartBodySelection,
      collections[0].vScale,
      plotAreaWidth,
      screenSizeIndex
    );
    /*
     Vertical axis label
     */
    this.createVertAxisLabel(
      // chartBodyChild,
      chartObject,
      chartBodySelection,
      styling,
      screenSizeIndex
    );
    /*
     Horizontal axis
     */
    this.createHorAxis(
      chartType,
      styling,
      chartBodySelection,
      collections[0].hScale,
      collections[0].labels,
      plotAreaHeight,
      screenSizeIndex
    );
    /*
     Horizontal axis label
     */
    this.createHorAxisLabel(
      // chartBodyChild,
      chartObject,
      chartBodySelection,
      plotAreaWidth,
      plotAreaMarginLeft,
      styling,
      screenSizeIndex
    );
    /*
     Plot Area
     */
    this.createPlotArea(
      chartType,
      collections,
      chartBodySelection,
      plotAreaMarginLeft,
      styling,
      tooltipSelection,
      screenSizeIndex
    );
    /*
     Legend
     */
    let chartLegendSelection: any = canvasSelection
      .append('g')
      .attr('class', 'chart-legend');
    // this.createLegend(
    //   chartLegendChild,
    //   chartObject,
    //   plotAreaMarginLeft,
    //   styling,
    //   screenSizeIndex
    // );
    /*
     Update height of canvas and background
     */
    let canvasHeight: number =
      styling.title.paddingTop[screenSizeIndex] +
      chartTitleSelection[0][0].getBBox().height +
      styling.title.paddingBottom[screenSizeIndex] +
      chartSubtitleSelection[0][0].getBBox().height +
      styling.chartBody.marginTop[screenSizeIndex] +
      chartBodyHeight +
      chartLegendSelection[0][0].getBBox().height;
    canvasSelection.style('height', canvasHeight);
    backgroundSelection.style('height', canvasHeight);
  }
  private createHorAxis(
    chartType: string,
    styling: iStylingObject,
    chartBodySelection: any,
    hScale: any,
    labels: string[],
    plotAreaHeight: number,
    screenSizeIndex: number
  ) : void {
    let dataGroupWidth: number;
    if (chartType === 'Bar') {
      labels.push('');
      let totDataPoints: number = labels.length - 1;
      dataGroupWidth = hScale(totDataPoints) / totDataPoints;
    }
    let hAxis: any = d3.svg.axis()
      .scale(hScale)
      .ticks(labels.length)
      .orient('bottom');
    let x: number =
      styling.chartBody.vAxis.label.marginLeft[screenSizeIndex] +
      styling.chartBody.vAxis.label.fontSize[screenSizeIndex] +
      styling.chartBody.vAxis.marginLeft[screenSizeIndex] +
      styling.chartBody.vAxis.fontSize[screenSizeIndex] * 2;
    let hAxisSelection: any = chartBodySelection
      .append('g')
      .attr('class', 'horAxis')
      .append('g')
      .call(hAxis)
      .attr({
        'class': 'axis',
        'transform': `translate(${x} ${plotAreaHeight})`
      });
    // Create tick labels
    let fontSize: number = styling.chartBody.vAxis.fontSize[screenSizeIndex];
    let labelsAngle: string = styling.chartBody.hAxis.ticks.labelsAngle[screenSizeIndex];
    let labelsHorShift: number = dataGroupWidth ? dataGroupWidth / 2 : 0;
    hAxisSelection.selectAll('.tick text')
      .data(labels)
      .text((d) => {return d})
      .style({
        'font-size': fontSize,
        'text-anchor': 'end'
      })
      .attr({
        'dy': 0,
        'transform':
        `translate(${labelsHorShift} ${fontSize}) rotate(${labelsAngle})`,
        'y': 0
      });
    // Styling axis
    let stroke: string = styling.chartBody.hAxis.stroke[screenSizeIndex];
    let strokeWidth: string =
      styling.chartBody.hAxis.strokeWidth[screenSizeIndex].toString() + 'px';
    hAxisSelection.select('.domain')
      .style({
        'fill': 'none',
        'stroke': stroke,
        'stroke-width': strokeWidth
      });
    // Styling tick lines
    let tickOpacity: number = styling.chartBody.hAxis.ticks.opacity[screenSizeIndex];
    let tickStroke: string = styling.chartBody.hAxis.ticks.stroke[screenSizeIndex];
    let tickStrokeWidth: number =
      styling.chartBody.hAxis.ticks.strokeWidth[screenSizeIndex];
    hAxisSelection.selectAll('.tick line')
      .attr('class', 'tick-line')
      .attr('y2', 6)
      .style({
        'opacity': tickOpacity,
        'stroke': tickStroke,
        'stroke-width': tickStrokeWidth
      });
    // Styling grid lines
    let gridOpacity: number = styling.chartBody.hAxis.gridLines.opacity[screenSizeIndex];
    let gridStroke: string = styling.chartBody.hAxis.gridLines.stroke[screenSizeIndex];
    let gridStrokeWidth: number =
      styling.chartBody.hAxis.gridLines.strokeWidth[screenSizeIndex];
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
    // chartContainerChild: ElementRef,
    chartObject: iChart,
    chartBodySelection: any,
    plotAreaWidth: number,
    plotAreaMarginLeft: number,
    styling: iStylingObject,
    screenSizeIndex: number
  ) : void {
    let x: number = plotAreaMarginLeft + plotAreaWidth / 2;
    // let y: number = chartContainerChild.nativeElement
    //   .querySelector('.canvas .chart-body .horAxis .axis')
    //   .getBBox().height;
    let y: number = chartBodySelection[0][0]
      .querySelector('.canvas .chart-body .horAxis .axis')
      .getBBox().height;
    let marginTop: number = styling.chartBody.hAxis.label.marginTop[screenSizeIndex];
    let fontSize: number = styling.chartBody.hAxis.label.fontSize[screenSizeIndex];
    let fontWeight: string = styling.chartBody.hAxis.label.fontWeight[screenSizeIndex];
    let hAxisLabel = chartBodySelection.select('.horAxis')
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
    chartLegendChild: ElementRef,
    chartObject: iChart,
    plotAreaMarginLeft: number,
    styling: iStylingObject,
    screenSizeIndex: number
  ) : void {
    let colors: string[] = styling.chartBody.plotArea.paletteRange[screenSizeIndex];
    let legendElement: HTMLElement = chartLegendChild.nativeElement;
    let legendContainer: HTMLElement = document.createElement('div');
    legendContainer.classList.add('legend-container');
    legendElement.insertBefore(
      legendContainer,
      legendElement.childNodes[legendElement.childNodes.length - 1]
    );
    let inputCollections: iChartColl[] = chartObject.collections;
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
    chartType: string,
    collections: iCollection[],
    chartSelection: any,
    marginLeft: number,
    styling: iStylingObject,
    tooltipSelection: any,
    screenSizeIndex: number
  ) {
    let paletteRange = styling.chartBody.plotArea.paletteRange[screenSizeIndex];
    let paletteScale: any = d3.scale.ordinal()
      .range(paletteRange);
    let plotAreaSelection: any = chartSelection
      .append('g')
      .attr('class', 'plotArea')
      .attr('transform', `translate(${marginLeft} 0)`);
    let tooltipFadeInDuration: number =
      styling.tooltip.fadeInDuration[screenSizeIndex];
    let tooltipFadeOutDuration: number =
      styling.tooltip.fadeOutDuration[screenSizeIndex];
    /*
     Create collections
     */
    if (chartType === 'Bar') {
      let length_Collections: number = collections.length;
      let barGap: number = styling.chartBody.plotArea.bar.barGap[screenSizeIndex];
      let totDataPoints: number = collections[0].labels.length;
      let hScale: any = collections[0].hScale;
      let dataGroupPadding: number =
        styling.chartBody.plotArea.bar.dataGroupPadding[screenSizeIndex];
      let dataGroupWidth: number = hScale(totDataPoints) / totDataPoints;
      let barWidth: number =
        (
          dataGroupWidth -
          2 * dataGroupPadding -
          barGap * (length_Collections - 1)
        ) / length_Collections;
      for (let i = 0; i < length_Collections; i++) {
        let hScale: any  = collections[i].hScale;
        let vScale: any  = collections[i].vScale;
        let values: number[] = collections[i].values;
        let collection: any = plotAreaSelection
          .append('g')
          .attr('class', 'collection');
        /*
         Bars
         */
        let newLine: string = '<br/>';
        let finalizeTooltip: Function = this.finalizeTooltip;
        let barSelection: any = collection.selectAll('.bar')
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
            'fill': paletteScale(i + 1),
            'height': function(d) { return (vScale(0) - vScale(d))},
            'width': barWidth + 'px'
          })
          .on('mouseover', function(d, index) {
            // Add shadow
            this.setAttribute(
              'stroke',
              styling.chartBody.plotArea.bar.selectionOutline.color[screenSizeIndex]
            );
            this.setAttribute(
              'stroke-opacity',
              styling.chartBody.plotArea.bar.selectionOutline.opacity[screenSizeIndex]
            );
            this.setAttribute(
              'stroke-width',
              styling.chartBody.plotArea.bar.selectionOutline.width[screenSizeIndex] ||
              barGap * 2
            );
            // Show tooltip
            tooltipSelection.html(
              collections[i].name + newLine +
              collections[i].labels[index] + ': ' + d
            );
            // Finalize tooltip
            finalizeTooltip(
              tooltipSelection,
              plotAreaSelection,
              tooltipFadeInDuration
            );
          })
          .on('mouseout', function(d) {
            // Remove shadow
            this.setAttribute('stroke', 'none');
            // Fade out tooltip
            tooltipSelection.transition()
              .duration(tooltipFadeOutDuration)
              .style('opacity', 0);
          });
        // If bar is selected, deselect it when user touches on body
        d3.select('body')[0][0]
          .addEventListener('touchstart', function() {
            // Deselect bar if selected
            let length: number = barSelection[0].length;
            for (let i = 0; i < length; i++) {
              if (barSelection[0][i].getAttribute('stroke') !== 'none') {
                barSelection[0][i].setAttribute('stroke', 'none');
                break;
              }
            }
          });
      }
    }
    else if (chartType === 'Line') {
      let dataPointDiameter: string =
        styling.chartBody.plotArea.dataPoint.diameterDeselected[screenSizeIndex] + 'px';
      let dataPointDiameterSelected: string =
        styling.chartBody.plotArea.dataPoint.diameterSelected[screenSizeIndex] + 'px';
      let strokeWidth: string =
        styling.chartBody.plotArea.path.strokeWidthDeselected[screenSizeIndex]
          .toString() + 'px';
      let strokeWidthSelected: string =
        styling.chartBody.plotArea.path.strokeWidthSelected[screenSizeIndex]
          .toString() + 'px';
      let strokeOpacity: number =
        styling.chartBody.plotArea.path.strokeOpacity[screenSizeIndex];
      let length_Collections: number = collections.length;
      for (let i = 0; i < length_Collections; i++) {
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
        let finalizeTooltip: Function = this.finalizeTooltip;
        let dataPointsSelection: any = collection.selectAll('circle')
          .data(values)
          .enter()
          .append('circle')
          .attr({
            'class': 'dataPoint',
            'cx': function(d, index) {return hScale(index)},
            'cy': function(d) { return vScale(d)},
            'fill': paletteScale(i + 1),
            'r': dataPointDiameter
          })
          .on('mouseover', function(d, index) {
            // Increase radius
            this.setAttribute('r', dataPointDiameterSelected);
            // Show tooltip
            tooltipSelection.html(
              collections[i].name + newLine +
              collections[i].labels[index] + ': ' + d
            );
            // Finalize tooltip
            finalizeTooltip(
              tooltipSelection,
              plotAreaSelection,
              tooltipFadeInDuration
            );
          })
          .on('mouseout', function(d) {
            // Decrease radius
            this.setAttribute('r', dataPointDiameter);
            // Fade out tooltip
            tooltipSelection.transition()
              .duration(tooltipFadeOutDuration)
              .style('opacity', 0);
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
    // Fade out active tooltip when user touches on body
    d3.select('body')[0][0]
      .addEventListener('touchstart', function() {
        // Fade out tooltip if active
        if (tooltipSelection.style('opacity') === '0.9') {
          tooltipSelection.transition()
            .duration(tooltipFadeOutDuration)
            .style('opacity', 0);
        }
      });
  }
  private createTitle(
    chartContainerWidth: number,
    chartTitleSelection: any,
    chartObjet: iChart,
    styling: iStylingObject,
    screenSizeIndex: number
  ) : void {
    let titleText: any = chartTitleSelection.append('text'),
      vertPos: number = styling.title.paddingTop[screenSizeIndex];
    titleText.text(chartObjet.title)
      .attr({
        'text-anchor': 'middle',
        'transform': `translate(0 ${vertPos})`,
        'x': chartContainerWidth / 2,
        'y': styling.title.fontSize[screenSizeIndex]
      })
      .style({
        'font-size': styling.title.fontSize[screenSizeIndex] + 'px',
        'font-weight': 'bold'
      });
    this.wrapText(titleText, chartContainerWidth);
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
      styling.chartBody.vAxis.label.marginLeft[screenSizeIndex] +
      styling.chartBody.vAxis.label.fontSize[screenSizeIndex] +
      styling.chartBody.vAxis.marginLeft[screenSizeIndex] +
      styling.chartBody.vAxis.fontSize[screenSizeIndex] * 2;
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
    let stroke: string = styling.chartBody.vAxis.stroke[screenSizeIndex];
    let strokeWidth: string =
      styling.chartBody.vAxis.strokeWidth[screenSizeIndex].toString() + 'px';
    vAxisSelection.select('.domain')
      .style({
        'fill': 'none',
        'stroke': stroke,
        'stroke-width': strokeWidth
      });
    // Styling tick lines
    let tickOpacity: number = styling.chartBody.vAxis.ticks.opacity[screenSizeIndex];
    let tickStroke: string = styling.chartBody.vAxis.ticks.stroke[screenSizeIndex];
    let tickStrokeWidth: number =
      styling.chartBody.vAxis.ticks.strokeWidth[screenSizeIndex];
    vAxisSelection.selectAll('.tick line')
      .attr('class', 'tick-line')
      .attr('x2', -6)
      .style({
        'opacity': tickOpacity,
        'stroke': tickStroke,
        'stroke-width': tickStrokeWidth
      });
    // Styling tick labels
    let fontSize: number = styling.chartBody.vAxis.fontSize[screenSizeIndex];
    vAxisSelection.selectAll('.tick text')
      .style({
        'font-size': fontSize
      });
    // Styling grid lines
    let gridOpacity: number = styling.chartBody.vAxis.gridLines.opacity[screenSizeIndex];
    let gridStroke: string = styling.chartBody.vAxis.gridLines.stroke[screenSizeIndex];
    let gridStrokeWidth: number =
      styling.chartBody.vAxis.gridLines.strokeWidth[screenSizeIndex];
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
    // chartContainerChild: ElementRef,
    chartObject: iChart,
    chartBodySelection: any,
    styling: iStylingObject,
    screenSizeIndex: number
  ) : void {
    // let height: number = chartContainerChild.nativeElement
    //   .querySelector('.canvas .chart-body .vertAxis .axis')
    //   .getBBox().height;
    let height: number = chartBodySelection[0][0]
      .querySelector('.canvas .chart-body .vertAxis .axis')
      .getBBox().height;
    let marginLeft: number = styling.chartBody.vAxis.label.marginLeft[screenSizeIndex];
    let fontSize: number = styling.chartBody.vAxis.label.fontSize[screenSizeIndex];
    let fontWeight: string = styling.chartBody.vAxis.label.fontWeight[screenSizeIndex];
    let dy: number = 0.75 * fontSize;
    let y: number = height / 2;
    let vAxisLabel = chartBodySelection.select('.vertAxis')
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
    let chartContainer: HTMLElement =
      this.alepNg2ChartContainerChild.nativeElement;
    let chartTitle: Element =
      chartContainer.getElementsByClassName('.chart-title')[0];
    chartContainer.removeChild(chartTitle);
    let chartSubtitle: Element =
      chartContainer.getElementsByClassName('.chart-subtitle')[0];
    chartContainer.removeChild(chartSubtitle);
    let chartBody: Element =
      chartContainer.getElementsByClassName('.chart-body')[0];
    chartContainer.removeChild(chartBody);
    let chartLegend: Element =
      chartContainer.getElementsByClassName('.chart-legend')[0];
    chartContainer.removeChild(chartLegend);

    // // Destroy chart
    // let parentChart: HTMLElement = this.alepNg2ChartBodyChild.nativeElement;
    // let childChart: SVGSVGElement = parentChart.getElementsByTagName('svg')[0];
    // parentChart.removeChild(childChart);
    // // Destroy legend
    // let parentLegend: HTMLElement = this.alepNg2ChartLegendChild.nativeElement;
    // let childLegend: Element =
    //   parentLegend.getElementsByClassName('legend-container')[0];
    // parentLegend.removeChild(childLegend);
    // // Destroy tooltip
    // let parentTooltip: HTMLElement = document.querySelector('body');
    // let childTooltip: Element =
    //   parentTooltip.getElementsByClassName('alep-ng2-chart-tooltip')[0];
    // parentTooltip.removeChild(childTooltip);
  }
  private getInitializedTooltip(
    styling: iStylingObject,
    screenSizeIndex: number,
    chartContainerId: number
  ) : any {
    let tooltipSelection: any = d3.select(`body`)
      .append('div')
      .attr('class', 'alep-ng2-chart-tooltip')
      .style({
        'background': styling.tooltip.backgroundColor[screenSizeIndex],
        'border': styling.tooltip.border[screenSizeIndex],
        'border-radius': styling.tooltip.borderRadius[screenSizeIndex],
        'color': styling.tooltip.fontColor[screenSizeIndex],
        'font': styling.tooltip.font[screenSizeIndex],
        'left': '0px',
        'opacity': 0,
        'padding': styling.tooltip.padding[screenSizeIndex],
        'top': '0px',
        'position': 'absolute'
      });
    tooltipSelection[0][0].setAttribute(
      'tooltip-id', chartContainerId
    );
    return tooltipSelection;
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
  private finalizeTooltip(
    tooltipSelection: any,
    plotAreaSelection: any,
    tooltipFadeInDuration: number
  ) : void {
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
      .duration(tooltipFadeInDuration)
      .style('opacity', 0.9);
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
  // Wrap Svg text element in different Svg tspan elements
  private wrapText(text: any, width: number) {
    let words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      x = text.attr("x"),
      y = text.attr("y"),
      dy = 0,
      fontSize = 1 + 'em',
      fontWeight = text.style('font-weight'),
      tspan = text.text(null)
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
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan")
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
