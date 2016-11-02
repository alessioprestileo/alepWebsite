import {
    Component, ElementRef, EventEmitter, HostListener, Input, OnInit, ViewChild
} from '@angular/core'

// import { iChart } from '../../models/iChart'
import { iChart } from './iChart'
import { iStylingObject } from './iStylingObject'

declare var d3: any;

interface iCollection {
  hScale: any,
  labels: string[],
  values: number[],
  vScale: any
}

@Component({
  selector: 'alep-ng2-chart-d3',
  templateUrl: 'alep-ng2-chart_d3.component.html',
  styleUrls: ['alep-ng2-chart_d3.component.css']
})
export class AlepNg2ChartD3Component implements OnInit {
  @HostListener('window:resize', ['$event'])
  private onResize(event: any) {
    this.emOnResize.emit();
  }
  @Input() private inputChartObject: iChart;
  @Input() private styling: iStylingObject = {
    aspectRatio: [1],
    largeScreenSize: 767,
    marginTop: 30,
    mediumScreenSize: 375,
    plotArea: {
      marginRight: 30,
      paletteRange: [
        '#F15854',
        '#5DA5DA',
        '#FAA43A',
        '#60BD68',
        '#F17CB0',
        '#B2912F',
        '#B276B2',
        '#DECF3F',
        '#4D4D4D'
      ],
      strokeWidthDeselected: [3],
      strokeWidthSelected: [5],
    },
    vAxis: {
      fontSize: 20,
      label: {
        fontSize: 20,
        marginLeft: 10
      },
      marginLeft: 10,
      width: 0
    }
  };
  @ViewChild(
      'alepNg2ChartContainer'
  ) private alepNg2ChartContainerChild: ElementRef;
  private canvasSelection: any;
  private chartContainerId: number;
  private emOnResize: EventEmitter<any> = new EventEmitter();
  private hasValidInput: boolean = true;
  private validTypes: string[] = [
    'Bar',
    'Line',
    'Area',
    'StackedBar',
    'StackedArea',
    'Pie',
    'PercentBar',
    'PercentArea',
    'Donut',
    'StepUpBar',
    'PolarArea',
    'Waterfall',
  ];

  constructor() {
  }

  ngOnInit() {
    this.emOnResize.subscribe(() => this.updateChart());
    this.setChartContainerId();
    this.buildChart();
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
      this.createChart(this.inputChartObject, this.styling);
    }
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
    let aspectRatio: number = styling.aspectRatio[0];
    let containerWidth: number =
      this.alepNg2ChartContainerChild.nativeElement.offsetWidth;
    let containerHeight: number = containerWidth / aspectRatio;
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
      .style('fill', 'white')
      .style('height', containerHeight)
      .style('width', containerWidth);
    let chartSelection: any = this.canvasSelection
      .append('g')
      .attr('class', 'chart')
      .attr('transform', `translate(0 ${styling.marginTop})`);
    /*
     Collections and scales
     */
    let plotAreaMarginRight: number = styling.plotArea.marginRight;
    let plotAreaMarginLeft: number =
      styling.vAxis.label.marginLeft +
      styling.vAxis.label.fontSize +
      styling.vAxis.marginLeft +
      styling.vAxis.fontSize * 2;
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
    let vAxis: any = d3.svg.axis()
      .scale(vScale)
      .orient('left');
    let x: number =
      styling.vAxis.label.marginLeft +
      styling.vAxis.label.fontSize +
      styling.vAxis.marginLeft +
      styling.vAxis.fontSize * 2;
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
    vAxisSelection.select('.domain')
      .style({
        'fill': 'none',
        'stroke': 'black',
        'stroke-width': '2px'
      });
    // Styling tick lines
    vAxisSelection.selectAll('.tick line')
      .attr('class', 'tick-line')
      .attr('x2', -6)
      .style({
        'opacity': 1,
        'stroke': 'black',
        'stroke-width': '1px'
      });
    // Styling grid lines
    vAxisSelection.selectAll('.tick')
      .append('line')
      .attr('class', 'grid-line')
      .attr('x2', plotAreaWidth)
      .style({
        'opacity': 0.3,
        'stroke': 'grey',
        'stroke-width': '1px'
      });
    /*
     Vertical axis label
     */
    this.createVertAxisLabel(
      chartObject, chartSelection, styling
    );
    /*
     Plot Area
     */
    this.createPlotArea(
      collections, chartSelection, plotAreaMarginLeft, styling
    );
  }
  private createHorAxis() : void {
  }
  private createLegend() : void {
  }
  private createPlotArea(
    collections: iCollection[],
    chartSelection: any,
    marginLeft: number,
    styling: iStylingObject
  ) {
    let paletteRange = styling.plotArea.paletteRange;
    let paletteScale: any = d3.scale.ordinal()
      .range(paletteRange);
    let strokeWidth: string = styling.plotArea.strokeWidthDeselected[0]
        .toString() + 'px';
    let strokeWidthSelected: string = styling.plotArea.strokeWidthSelected[0]
        .toString() + 'px';
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
      let path: any = collection
        .append('path')
        .attr({
          class: 'path',
          d: lineGenerator(values)
        })
        .style({
          fill: 'none',
          stroke: paletteScale(i + 1),
          'stroke-opacity': 1,
          'stroke-width': strokeWidth
        });
    }
    // Event handling
    let pathElements: SVGPathElement[] = this.alepNg2ChartContainerChild
      .nativeElement
      .querySelectorAll('.canvas .chart .collection .path');
    let lengthPaths: number = pathElements.length;
    for (let i = 0; i < lengthPaths; i++) {
      let pathElement: SVGPathElement = pathElements[i];
      pathElement.onmouseover = (event) => {
        let currentStrokeWidth: string = event.target['style']['strokeWidth'];
        if (currentStrokeWidth !== strokeWidthSelected) {
          event.target['style']['strokeWidth'] = strokeWidthSelected;
        }
      };
      pathElement.onmouseout = (event) => {
        event.target['style']['strokeWidth'] = strokeWidth;
      };
    }
  }
  private createVertAxis() : void {
  }
  private createVertAxisLabel(
    chartObject: iChart,
    chartSelection: any,
    styling: iStylingObject
  ) : void {
    let height: number = this.alepNg2ChartContainerChild.nativeElement
      .querySelector('.canvas .chart .vertAxis .axis')
      .getBBox().height;
    let marginLeft: number = styling.vAxis.label.marginLeft;
    let fontSize: number = styling.vAxis.label.fontSize;
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
        'font-weight': 'normal'
      });
  }
  private isMobile() : boolean {
    let result : boolean;
    result = window.innerWidth <= 768 ?
        true :
        false;
    return result;
  }
  private prepareContainer(chartContainerId: number) : void {
    this.alepNg2ChartContainerChild.nativeElement.setAttribute(
        'container-id', chartContainerId
    );
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
    let parent: HTMLElement = this.alepNg2ChartContainerChild.nativeElement;
    let child: SVGSVGElement = parent.getElementsByTagName('svg')[0];
    parent.removeChild(child);
    this.buildChart();
  }
}
