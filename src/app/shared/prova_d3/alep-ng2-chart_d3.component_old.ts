import {
  Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy,
  OnInit, ViewChild
} from '@angular/core';

import { Subscription } from 'rxjs/Rx';

// import { iAlepNg2InputChart } from '../../models/iAlepNg2InputChart'
import { iAlepNg2InputChart } from './iAlepNg2InputChart';
import {iAlepNg2InputChartColl} from "./iAlepNg2InputChartColl";
import { iStylingChart } from './iChartStyling';

declare var d3: any;

interface iCollection_old {
  hScale: any,
  labels: string[],
  maxVal: number,
  minVal: number,
  name: string,
  values: number[],
  vScale: any
}
interface iDefaultChartStylings {
  barStyling: iStylingChart,
  donutStyling: iStylingChart,
  lineStyling: iStylingChart,
  pieStyling: iStylingChart
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
    this.emOnResize.emit();
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
  private emOnResize: EventEmitter<any> = new EventEmitter();
  private finalStyling: iStylingChart;
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
    this.destroyCanvas();
  }

  private buildChart() : void {
    try {
      this.checkInputValidity(this.inputChart.type, this.validTypes);
    }
    catch (error) {
      this.hasValidInput = false;
      console.log('Error: ', error.message, '\n', error.stack);
    }
    if (this.hasValidInput === true) {
      this.assignIdToChartContainer(this.chartContainerId);
      this.setFinalStyling(
        this.inputChart.type,
        this.inputStyling,
        this.defaultChartStylings
      );
      this.responsiveStyling(this.finalStyling);
      this.createChart(
        this.alepNg2ChartContainerChild,
        this.chartContainerId,
        this.inputChart,
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
    chartContainerChild: ElementRef,
    chartContainerId: number,
    inputChart: iAlepNg2InputChart,
    styling: iStylingChart
  ) : void {
    let chartType: string = inputChart.type;
    let screenSizeIndex: number = this.getScreenSizeIndex(styling);
    let canvasWidth: number = chartContainerChild.nativeElement.offsetWidth;
    /*
     Tooltip
     */
    let tooltipSelection: any = this.createTooltip(
      styling,
      screenSizeIndex,
      chartContainerId
    );
    /*
     Chart
     */
    let canvasSelection: any = d3.select(
      `.alep-ng2-chart-container[container-id="${chartContainerId}"`
    )
      .append('svg')
      .attr('class', 'canvas')
      .style('height', window.innerHeight)
      .style('width', canvasWidth);
    // Get correct value for canvasWidth. For some reason the correct value
    // is given only after appending the canvas, and only if the height of the
    // canvas is a large enough value.
    canvasWidth = chartContainerChild.nativeElement.offsetWidth;
    // Update canvas width
    canvasSelection.style('width', canvasWidth);
    /*
     Background
     */
    let backgroundSelection: any = canvasSelection
      .append('rect')
      .attr('class', 'background')
      .style('fill', styling.backgroundColor[screenSizeIndex])
      .style('width', canvasWidth);
    /*
     Chart title
     */
    let chartTitleVPos: number = styling.title.marginTop[screenSizeIndex];
    let chartTitleSelection: any = this.createTitle(
      canvasSelection,
      chartTitleVPos,
      inputChart,
      styling,
      screenSizeIndex);
    /*
     Chart subtitle
     */
    let chartSubtitleVPos: number =
      chartTitleSelection[0][0].getBBox().height +
      chartTitleVPos +
      styling.subtitle.marginTop[screenSizeIndex];
    let chartSubtitleSelection: any = this.createSubtitle(
      canvasSelection,
      chartSubtitleVPos,
      inputChart,
      styling,
      screenSizeIndex
    );
    /*
     Chart body
     */
    let chartBodyWidth: number =
      canvasWidth -
      styling.chartBody.marginLeft[screenSizeIndex] -
      styling.chartBody.marginRight[screenSizeIndex];
    let outerRadius: number = 0;
    if (chartType === 'Donut' ||
        chartType === 'Pie') {
      outerRadius = styling.chartBody.plotArea.slice.outerRadius ?
        styling.chartBody.plotArea.slice.outerRadius[screenSizeIndex] :
        chartBodyWidth / 2;
    }
    let chartBodyVPos: number =
      chartSubtitleVPos +
      chartSubtitleSelection[0][0].getBBox().height +
      styling.chartBody.marginTop[screenSizeIndex] +
      outerRadius;
    let chartBodyHPos: number =
      styling.chartBody.marginLeft[screenSizeIndex] +
      outerRadius;
    let chartBodySelection: any = canvasSelection
      .append('g')
      .attr('class', 'chart-body')
      .attr(
        'transform',
        `translate(${chartBodyHPos} ${chartBodyVPos})`);
    /*
     Plot area dimensions
     */
    let plotAreaDimensions: iPlotAreaDimensions =
      this.calculatePlotAreaDimensions(
        chartType,
        chartBodyWidth,
        styling,
        screenSizeIndex
      );
    /*
     Collections and scales
     */
    let collections: iCollection_old[] = this.createCollectionsAndScales(
      chartType,
      inputChart.collections,
      plotAreaDimensions
    );
    /*
     Axes (only for chartTypes 'Bar' and 'Line')
     */
    let hAxisGroupHeight: number = 0;
    let hAxisGroupSelection: any;
    if ((chartType === 'Bar') || (chartType === 'Line')) {
      /*
       Vertical axis
       */
      let vAxisGroupSelection: any= this.createVAxis(
        chartBodySelection,
        collections[0].vScale,
        plotAreaDimensions.width,
        styling,
        screenSizeIndex
      );
      /*
       Vertical axis label
       */
      this.createVAxisLabel(
        inputChart,
        vAxisGroupSelection,
        styling,
        screenSizeIndex
      );
      /*
       Horizontal axis
       */
      hAxisGroupSelection = this.createHAxis(
        chartType,
        chartBodySelection,
        collections[0].hScale,
        collections[0].labels,
        plotAreaDimensions.height,
        styling,
        screenSizeIndex
      );
      /*
       Horizontal axis label
       */
      hAxisGroupHeight =
        hAxisGroupSelection[0][0].getBBox().height -
        plotAreaDimensions.height;
      this.createHAxisLabel(
        inputChart,
        chartBodySelection,
        hAxisGroupHeight,
        plotAreaDimensions.width,
        styling,
        screenSizeIndex
      );
      hAxisGroupHeight =
        hAxisGroupSelection[0][0].getBBox().height -
        plotAreaDimensions.height;
    }
    /*
     Plot Area
     */
    this.createPlotArea(
      chartType,
      collections,
      chartBodySelection,
      plotAreaDimensions,
      tooltipSelection,
      styling,
      screenSizeIndex
    );
    /*
     Legend
     */
    let legendVPos: number =
      chartBodyVPos - outerRadius +
      plotAreaDimensions.height +
      hAxisGroupHeight +
      styling.legend.marginTop[screenSizeIndex];
    let chartLegendSelection: any = this.createLegend(
      chartType,
      canvasSelection,
      legendVPos,
      collections,
      plotAreaDimensions.hPos,
      styling,
      screenSizeIndex
    );
    /*
     Assign correct height to canvas and background
     */
    let canvasHeight: number =
      legendVPos +
      chartLegendSelection[0][0].getBBox().height +
      styling.legend.marginBottom[screenSizeIndex];
    canvasSelection.style('height', canvasHeight);
    backgroundSelection.style('height', canvasHeight);
  }
  private calculatePlotAreaDimensions(
    chartType: string,
    chartBodyWidth: number,
    styling: iStylingChart,
    screenSizeIndex: number
  ) : iPlotAreaDimensions {
    let aspectRatio: number = styling.aspectRatio[screenSizeIndex];
    let height: number;
    let marginLeft: number;
    let marginRight: number = 0;
    let vAxisWidth: number = 0;
    let width: number;
    if ((chartType === 'Bar') ||
       (chartType === 'Line')) {
      vAxisWidth =
        styling.chartBody.vAxis.label.fontSize[screenSizeIndex] +
        styling.chartBody.vAxis.marginLeft[screenSizeIndex] +
        styling.chartBody.vAxis.fontSize[screenSizeIndex] * 2;
    }
    // marginRight = styling.chartBody.marginRight[screenSizeIndex];
    marginLeft =
      // styling.chartBody.hPos[screenSizeIndex] +
      vAxisWidth;
    width =
      chartBodyWidth -
      marginLeft -
      marginRight;
    height = width / aspectRatio;
    return {
      aspectRatio: aspectRatio,
      height: height,
      hPos: marginLeft,
      width: width
    };
  }
  private createCollectionsAndScales(
    chartType: string,
    collectionsSrc: iAlepNg2InputChartColl[],
    plotAreaDimensions: iPlotAreaDimensions
  ) : iCollection_old[] {
    /*
     Labels and values
     */
    let collections: iCollection_old[] = [];
    let maxVal: number = 0;
    let minVal: number = 0;
    if (chartType === 'Bar' ||
        chartType === 'Donut' ||
        chartType === 'Line' ||
        chartType === 'Pie') {
      // Fill collections array
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
            hScale: null,
            labels: labels,
            maxVal: maxVal,
            minVal: minVal,
            name: name,
            values: values,
            vScale: null
          }
        );
      }
    }
    /*
     Scales
     */
    let plotAreaHeight: number;
    let plotAreaWidth: number;
    if ((chartType === 'Bar') ||
      (chartType === 'Line')) {
      plotAreaWidth = plotAreaDimensions.width;
      plotAreaHeight = plotAreaDimensions.height;
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
      let vScale: any;
      for (let collection of collections) {
        // Only one vScale is used for all the collections. The scale's domain
        // is obtained by using values of maxVal and minVal calculated over all
        // the collections.
        vScale = d3.scale.linear()
          .domain([minVal, maxVal])
          .range([plotAreaHeight, 0]);
        collection.hScale = hScale;
        collection.vScale = vScale;
      }
    }
    return collections;
  }
  private createHAxis(
    chartType: string,
    chartBodySelection: any,
    hScale: any,
    labels: string[],
    plotAreaHeight: number,
    styling: iStylingChart,
    screenSizeIndex: number
  ) : any {
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
      styling.chartBody.marginLeft[screenSizeIndex] +
      styling.chartBody.vAxis.label.fontSize[screenSizeIndex] +
      styling.chartBody.vAxis.marginLeft[screenSizeIndex] +
      styling.chartBody.vAxis.fontSize[screenSizeIndex] * 2;
    let hAxisGroupSelection: any = chartBodySelection
      .append('g')
      .attr('class', 'horAxis')
      .attr('transform', `translate(${x} ${plotAreaHeight})`);
    let hAxisSelection: any = hAxisGroupSelection
      .append('g')
      .call(hAxis)
      .attr('class', 'axis');
    // Create tick labels
    let fontSize: number = styling.chartBody.vAxis.fontSize[screenSizeIndex];
    let labelsAngle: number =
      styling.chartBody.hAxis.ticks.labelsAngle[screenSizeIndex];
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
    let tickOpacity: number = styling.chartBody.hAxis
      .ticks
      .opacity[screenSizeIndex];
    let tickStroke: string = styling.chartBody.hAxis
      .ticks
      .stroke[screenSizeIndex];
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
    let gridOpacity: number = styling.chartBody.hAxis
      .gridLines
      .opacity[screenSizeIndex];
    let gridStroke: string = styling.chartBody.hAxis
      .gridLines
      .stroke[screenSizeIndex];
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
    return hAxisGroupSelection;
  }
  private createHAxisLabel(
    chartObject: iAlepNg2InputChart,
    chartBodySelection: any,
    hAxisHeight: number,
    plotAreaWidth: number,
    styling: iStylingChart,
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
    let y: number = hAxisHeight + fontSize;
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
    return hAxisLabel;
  }
  private createLegend(
    chartType: string,
    canvasSelection: any,
    legendVPos: number,
    collections: iCollection_old[],
    plotAreaHPos: number,
    styling: iStylingChart,
    screenSizeIndex: number
  ) : any {
    let paletteRange = styling.chartBody.plotArea.paletteRange[screenSizeIndex];
    let paletteScale = this.createPaletteScale(
      collections.length,
      paletteRange
    );
    let legendHPos: number =
      styling.chartBody.marginLeft[screenSizeIndex] +
      plotAreaHPos;
    let chartLegendSelection: any = canvasSelection
      .append('g')
      .attr('class', 'chart-legend')
      .attr('transform', `translate(${legendHPos} ${legendVPos})`);
    if (chartType === 'Bar' ||
        chartType === 'Line') {
      for (let i = 0; i < collections.length; i++) {
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
        let legendEntry: any = chartLegendSelection
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
            'fill': paletteScale(i),
            'height': symbolHeight,
            'width': symbolWidth
          });
        legendEntry
          .append('text')
          .attr('class', 'legend-entry-text')
          .text(collections[i].name)
          .attr({
            'font-size': fontSize,
            'transform':
              `translate(${symbolWidth + textMarginLeft} ${symbolHeight})`
          });
      }
    }
    else if (chartType === 'Donut' ||
             chartType === 'Pie') {
      let collection = collections[0];
      for (let i = 0; i < collection.values.length; i++) {
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
        let legendEntry: any = chartLegendSelection
          .append('g')
          .attr('class', 'legend-entry')
          .attr(
            'transform',
            `translate(${plotAreaHPos} ${legendEntryVPos})`
          );
        legendEntry
          .append('rect')
          .attr('class', 'legend-entry-symbol')
          .attr({
            'fill': paletteScale(i),
            'height': symbolHeight,
            'width': symbolWidth
          });
        legendEntry
          .append('text')
          .attr('class', 'legend-entry-text')
          .text(collection.labels[i])
          .attr({
            'font-size': fontSize,
            'transform':
              `translate(${symbolWidth + textMarginLeft} ${symbolHeight})`
          });
      }
    }
    return chartLegendSelection;
  }
  private createPaletteScale(
    domainLength: number,
    range: string[]
  ) : any {
    let domain: number[] = [];
    for (let i = 0; i < domainLength; i++) {
      domain.push(i);
    }
    let paletteScale: any = d3.scale.ordinal()
      .domain(domain)
      .range(range);
    return paletteScale;
  }
  private createPlotArea(
    chartType: string,
    collections: iCollection_old[],
    chartSelection: any,
    plotAreaDimensions: iPlotAreaDimensions,
    tooltipSelection: any,
    styling: iStylingChart,
    screenSizeIndex: number
  ) : any {
    let paletteRange = styling.chartBody.plotArea.paletteRange[screenSizeIndex];
    let paletteScale = this.createPaletteScale(
      collections.length,
      paletteRange
    );
    let hPos: number = plotAreaDimensions.hPos;
    let plotAreaSelection: any = chartSelection
      .append('g')
      .attr('class', 'plotArea')
      .attr('transform', `translate(${hPos} 0)`);
    let tooltipFadeInDuration: number =
      styling.tooltip.fadeInDuration[screenSizeIndex];
    let tooltipFadeOutDuration: number =
      styling.tooltip.fadeOutDuration[screenSizeIndex];
    /*
     Draw collections
     */
    let newLine: string = '<br/>';
    let finalizeTooltip: Function = this.finalizeTooltip;
    if (chartType === 'Bar') {
      let length_Collections: number = collections.length;
      let barGap: number = styling.chartBody.plotArea
        .bar.
        barGap[screenSizeIndex];
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
            'fill': paletteScale(i),
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
            tooltipSelection.html(
              collections[i].name + newLine +
              collections[i].labels[index] + ': ' + d
            );
            // Finalize tooltip
            finalizeTooltip(
              tooltipSelection,
              plotAreaSelection,
              tooltipFadeInDuration,
              styling,
              screenSizeIndex
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
    else if (chartType === 'Donut' ||
      chartType === 'Pie') {
      let collection: iCollection_old = collections[0];
      let outerRadius: number =
        styling.chartBody.plotArea.slice.outerRadius ?
          styling.chartBody.plotArea.slice.outerRadius[screenSizeIndex] :
        plotAreaDimensions.width / 2;
      let innerRadius: number;
      if (chartType === 'Donut') {
        innerRadius =
          styling.chartBody.plotArea.slice.innerRadius ?
            styling.chartBody.plotArea.slice.innerRadius[screenSizeIndex] :
          outerRadius / 3;
      }
      else {
        innerRadius = 0;
      }
      let sliceArc: any = d3.svg.arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadius);
      let pieLayout: any = d3.layout.pie()
        .sort(null)
        .value(function(d) {return d});
      let sliceSelection: any = plotAreaSelection.selectAll(".slice")
        .data(pieLayout(collection.values))
        .enter()
        .append("g")
        .attr("class", "slice");
      sliceSelection.append("path")
        .attr("class", "arc")
        .attr("d", sliceArc)
        .style("fill", function(d, index) {return paletteScale(index)})
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
          tooltipSelection.html(
            collection.name + newLine +
            collection.labels[index] + ': ' + d.value
          );
          // Finalize tooltip
          finalizeTooltip(
            tooltipSelection,
            plotAreaSelection,
            tooltipFadeInDuration,
            styling,
            screenSizeIndex
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
      // If slice is selected, deselect it when user touches on body
      d3.select('body')[0][0]
        .addEventListener('touchstart', function() {
          // Deselect slice if selected
          let length: number = sliceSelection[0].length;
          for (let i = 0; i < length; i++) {
            let sliceArcSelection: any = sliceSelection[0][i]
              .querySelector('.arc');
            if (sliceArcSelection.getAttribute('stroke') !== 'none') {
              sliceArcSelection.setAttribute('stroke', 'none');
              break;
            }
          }
        });
    }
    else if (chartType === 'Line') {
      let dataPointDiameter: string =
        styling.chartBody.plotArea
          .dataPoint
          .diameterDeselected[screenSizeIndex] + 'px';
      let dataPointDiameterSelected: string =
        styling.chartBody.plotArea
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
            stroke: paletteScale(i),
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
            'fill': paletteScale(i),
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
              tooltipFadeInDuration,
              styling,
              screenSizeIndex
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
        if (
          tooltipSelection.style('opacity') ===
          styling.tooltip.opacity[screenSizeIndex].toString()
        ) {
          tooltipSelection.transition()
            .duration(tooltipFadeOutDuration)
            .style('opacity', 0);
        }
      });
    return plotAreaSelection;
  }
  private createSubtitle(
    canvasSelection: any,
    vPos: number,
    chartObject: iAlepNg2InputChart,
    styling: iStylingChart,
    screenSizeIndex: number
  ) : any {
    let chartSubtitleSelection: any = canvasSelection
      .append('g')
      .attr('class', 'chart-subtitle');
    let width: number = parseFloat(canvasSelection.style('width'));
    let subtitleText: any = chartSubtitleSelection.append('text');
    subtitleText.text(chartObject.subtitle)
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
    this.wrapText(subtitleText, width);
    return chartSubtitleSelection;
  }
  private createTitle(
    canvasSelection: any,
    vPos: number,
    chartObject: iAlepNg2InputChart,
    styling: iStylingChart,
    screenSizeIndex: number
  ) : any {
    let chartTitleSelection: any = canvasSelection
      .append('g')
      .attr('class', 'chart-title');
    let width: number = parseFloat(canvasSelection.style('width'));
    let titleText: any = chartTitleSelection.append('text');
    titleText.text(chartObject.title)
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
    this.wrapText(titleText, width);
    return chartTitleSelection;
  }
  private createTooltip(
    styling: iStylingChart,
    screenSizeIndex: number,
    chartContainerId: number
  ) : any {
    let tooltipSelection: any = d3.select(`body`)
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
  private createVAxis(
    chartSelection: any,
    vScale: any,
    plotAreaWidth: number,
    styling: iStylingChart,
    screenSizeIndex: number
  ) : any {
    let vAxis: any = d3.svg.axis()
      .scale(vScale)
      .orient('left');
    let x: number =
      styling.chartBody.marginLeft[screenSizeIndex] +
      styling.chartBody.vAxis.label.fontSize[screenSizeIndex] +
      styling.chartBody.vAxis.marginLeft[screenSizeIndex] +
      styling.chartBody.vAxis.fontSize[screenSizeIndex] * 2;
    let y: number = 0;
    let vAxisGroupSelection: any = chartSelection
      .append('g')
      .attr('class', 'vertAxis');
    let vAxisSelection: any = vAxisGroupSelection
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
    let tickOpacity: number = styling.chartBody.vAxis
      .ticks
      .opacity[screenSizeIndex];
    let tickStroke: string = styling.chartBody.vAxis
      .ticks
      .stroke[screenSizeIndex];
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
    let gridOpacity: number = styling.chartBody.vAxis
      .gridLines
      .opacity[screenSizeIndex];
    let gridStroke: string = styling.chartBody.vAxis
      .gridLines
      .stroke[screenSizeIndex];
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
    return vAxisGroupSelection;
  }
  private createVAxisLabel(
    chartObject: iAlepNg2InputChart,
    vAxisGroupSelection: any,
    styling: iStylingChart,
    screenSizeIndex: number
  ) : any {
    let height: number = vAxisGroupSelection[0][0].getBBox().height;
    let marginLeft: number = styling.chartBody.marginLeft[screenSizeIndex];
    let fontSize: number = styling.chartBody.vAxis
      .label
      .fontSize[screenSizeIndex];
    let fontWeight: string = styling.chartBody.vAxis
      .label
      .fontWeight[screenSizeIndex];
    let dy: number = 0.75 * fontSize;
    let y: number = height / 2;
    let vAxisLabel = vAxisGroupSelection
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
    return vAxisLabel;
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
  private finalizeTooltip(
    tooltipSelection: any,
    plotAreaSelection: any,
    tooltipFadeInDuration: number,
    styling: iStylingChart,
    screenSizeIndex: number
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
      .style(
        'opacity',
        styling.tooltip.opacity[screenSizeIndex]
      );
  }
  private assignIdToChartContainer(chartContainerId: number) : void {
    this.alepNg2ChartContainerChild.nativeElement.setAttribute(
      'container-id',
      chartContainerId
    );
  }
  private recursiveMergeStyling (
    inputStyling: Object,
    defaultStyling: iStylingChart,
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
  private responsiveStyling(styling: iStylingChart) : void {

    for (let prop in styling) {
      if (styling[prop] === null) {
        continue;
      }
      else if (
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
    chartType: string,
    inputStyling: Object,
    defaultChartStylings: iDefaultChartStylings
  ) : void {
    let temp: Object = {};
    let defaultStyling: iStylingChart;
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
    this.recursiveMergeStyling(inputStyling, defaultStyling, temp);
    this.finalStyling = (<iStylingChart>temp);
  }
  private updateChart() : void {
    this.destroyCanvas();
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
      tSpan = text.text(null)
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
        tSpan = text.append("tspan")
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
