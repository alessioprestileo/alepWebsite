import {
    Component, ElementRef, EventEmitter, HostListener, Input, OnInit, ViewChild
} from '@angular/core'

// import { iChart } from '../../models/iChart'
import { iChart } from './/iChart'

declare var d3: any;

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
  @ViewChild(
      'alepNg2ChartContainer'
  ) private alepNg2ChartContainerChild: ElementRef;
  private canvas: any;
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

    // console.log('this.inputChartObject = ', this.inputChartObject);

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
      this.createChart(this.inputChartObject);
      this.formatChart();
    }
  }
  private checkInputValidity(chartType: string, validTypes: string[]) : void {
    let typeIndex: number = validTypes.indexOf(chartType);
    if (typeIndex === -1) {
      throw new Error(`Chart type '${chartType}' is not a valid type.`);
    }
  }
  private createChart(
      chartObject: iChart
  ) : void {
    let containerWidth: number =
      this.alepNg2ChartContainerChild.nativeElement.offsetWidth;
    this.canvas = d3.select(
      `.alep-ng2-chart-container[container-id="${this.chartContainerId}"`
    )
      .append('svg')
      .attr('class', 'canvas')
      .attr('height', containerWidth)
      .attr('width', containerWidth);
    let background: any = this.canvas
      .append('rect')
      .attr('class', 'background')
      .attr('height', containerWidth)
      .attr('fill', 'white')
      .attr('width', containerWidth);
    let chart: any = this.canvas
      .append('g')
      .attr('class', 'chart');
    let paletteRange: string[] = [
      '#F15854',
      '#5DA5DA',
      '#FAA43A',
      '#60BD68',
      '#F17CB0',
      '#B2912F',
      '#B276B2',
      '#DECF3F',
      '#4D4D4D'
    ];
    let paletteScale: any = d3.scale.ordinal()
      .range(paletteRange);
    // Create collections
    for (let i = 0; i < chartObject.collections.length; i++) {
      let dataPoints: any = chartObject.collections[i].dataSet.dataPoints;
      let labels: string[] = [];
      let values: number[] = [];
      for (let label in dataPoints) {
        labels.push(label);
        values.push(dataPoints[label]);
      }
      let hScale: any = d3.scale.linear()
        .domain([0, labels.length - 1])
        .range([0, containerWidth]);
      let vScale: any = d3.scale.linear()
        .domain([d3.min(values), d3.max(values)])
        .range([containerWidth, 0]);
      let lineGenerator: any = d3.svg.line()
        .x(function(d, index) {return hScale(index)})
        .y(function(d) { return vScale(d)})
        .interpolate('linear');
      let collection: any = chart
        .append('g')
        .attr('class', 'collection');
      let strokeWidth: number = 1.5;
      let strokeWidthSelected: number = 3;
      let path: any = collection
        .append('path')
        .attr({
          class: 'path',
          d: lineGenerator(values),
          fill: 'none',
          stroke: paletteScale(i + 1),
          strokeOpacity: 1,
          strokeWidth: strokeWidth
        })
        // .on('mouseenter', () => {
        //   return path.attr('stroke-width', strokeWidthSelected)
        // })
        // .on('mouseleave', () => {
        //   return path.attr('stroke-width', strokeWidth)
        // })
        ;
    }
    // Event handling
    let pathElement: SVGPathElement = this.alepNg2ChartContainerChild
      .nativeElement
      .querySelectorAll('.canvas .chart .collection .path')[0];

    console.log('pathSelection = ', pathElement);

    pathElement.onmouseover = (event) => {
      let strokeWidthIndex: number;
      for (let i = 0; i < event.srcElement.attributes.length; i++) {
        if (event.srcElement.attributes[i].name === 'strokeWidth') {
          strokeWidthIndex = i;
          break;
        }
      }

      console.log('event = ', event);
      console.log('event = ', event.srcElement.attributes[strokeWidthIndex].value);

      let currentStrokeWidth: string = event.srcElement
        .attributes[strokeWidthIndex].value;
      if (currentStrokeWidth === '1.5') {
        pathElement.style.strokeWidth = '3';
      }
      else {
        pathElement.style.strokeWidth = '1.5';
      }
    };

  }
  private formatChart() : void {
  }
  private formatHorAxis(horAxis: any) : void {
  }
  private formatValues(collections: any) : void {
  }
  private formatVertAxis(vertAxis: any) : void {
  }
  private formatLegend(legendElements: any) : void {
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
