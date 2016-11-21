import {
    Component, ElementRef, EventEmitter, HostListener, Input, OnInit, ViewChild
} from '@angular/core'

// import { iAlepNg2InputChart } from '../../models/iAlepNg2InputChart'
import { iChart } from './iChart'

declare var uv: any;

@Component({
  selector: 'alep-ng2-chart',
  templateUrl: 'alep-ng2-chart.component.html',
  styleUrls: ['alep-ng2-chart.component.css']
})
export class AlepNg2ChartComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  private onResize(event: any) {
    this.emOnResize.emit();
  }
  /*
    Inputs properties defined using the uvCharts API
    (http://imaginea.github.io/uvCharts/documentation.html)
   ****************************************************************************/
  @Input() private inputConfig: Object = {
    effects: {
      duration: 0
    },
    graph: {
      orientation: 'Vertical',
      palette: 'Soft',
      responsive: true
    },
    meta: {}
  };
  @Input() private inputGraphDef: Object;
  @Input() private inputType: string = 'Bar';
  /****************************************************************************/
  /*
    Input properties defined using the iAlepNg2InputChart interface. When this object is
    given, its properties override the corresponding properties defined using
    the uvCharts API
  *****************************************************************************/
  @Input() private inputChartObject: iChart;
  /****************************************************************************/
  @ViewChild(
      'alepNg2ChartContainer'
  ) private alepNg2ChartContainerChild: ElementRef;
  private caption: string;
  private chartContainerId: number;
  private chartObject: any;
  private emOnResize: EventEmitter<any> = new EventEmitter();
  private finalConfig: Object = {};
  private finalGraphDef: Object = {};
  private finalType: string;
  private hasValidInput: boolean = true;
  private subCaption: string;
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
    this.processInputs(
        this.inputConfig, this.inputGraphDef, this.inputType,
        this.inputChartObject, this.chartContainerId
    );
    try {
      this.checkInputValidity(this.finalType, this.validTypes);
    }
    catch (error) {
      this.hasValidInput = false;
      console.log('Error: ', error.message, '\n', error.stack);
    }
    if (this.hasValidInput === true) {
      this.prepareContainer(this.chartContainerId);
      this.createChart(this.finalConfig, this.finalGraphDef, this.finalType);
      this.formatChart();
    }
  }
  private checkInputValidity(finalType: string, validTypes: string[]) : void {
    let typeIndex: number = validTypes.indexOf(finalType);
    if (typeIndex === -1) {
      throw new Error(`Chart type '${finalType}' is not a valid type.`);
    }
  }
  private createChart(
      finalConfig: Object, finalGraphDef: Object, finalType: string
  ) : void {
    this.chartObject = uv.chart(
        finalType,
        finalGraphDef,
        finalConfig
    );
  }
  private formatChart() : void {
    let defaultFrameHeight: number = 600;
    let container: HTMLElement = this.alepNg2ChartContainerChild.nativeElement;
    let panel: any = container
      .getElementsByClassName('uv-chart-div')[0]
      .getElementsByClassName('uv-frame')[0]
      .getElementsByClassName('uv-panel')[0];
    let collections: any = panel
      .getElementsByClassName('uv-chart')[0]
      .querySelectorAll('g');
    this.formatValues(collections);
    let horAxis: any = panel.getElementsByClassName('uv-hor-axis')[0];
    this.formatHorAxis(horAxis);
    let vertAxis: any = panel.getElementsByClassName('uv-ver-axis')[0];
    this.formatVertAxis(vertAxis);
    let legendElements: any = panel
      .getElementsByClassName('uv-legend')[0]
      .getElementsByTagName('g');
    let dy : number = this.formatLegend(legendElements);
    let newFrameHeight: number = defaultFrameHeight + dy;
    let frame: any = container
      .getElementsByClassName('uv-chart-div')[0]
      .getElementsByClassName('uv-frame')[0];
    frame.setAttribute('viewBox', `0 0 600 ${newFrameHeight}`);
    let background: any = frame.getElementsByTagName('rect')[0];
    background.setAttribute('height', newFrameHeight);
  }
  private formatHorAxis(horAxis: any) : void {
    let ticks: any = horAxis
      .getElementsByTagName('g')[0]
      .getElementsByClassName('tick');
    for (let i = 0; i < ticks.length; i++) {
      let label = ticks[i].getElementsByTagName('text')[0];
      label.style.fontSize = '20';
      label.style.textAnchor = 'end';
      label.style.transform = 'rotate(-30deg)';
    }
  }
  private formatValues(collections: any) : void {
    for (let i = 0; i < collections.length; i++) {
      let collection: any = collections[i];
      if (collection.attributes.class.value.includes('cge-')) {
        let path: any = collection.getElementsByTagName('path')[0];

        // this.chartObject.effects = {};
        // this.chartObject.effects['line'] = {};
        // this.chartObject.effects['line']['mouseover'] = null;

        // console.log('this.chartObject.effects 1 = ', this.chartObject.effects);
        //
        // for (let collection in this.chartObject.effects) {
        //
        //   console.log(collection);
        //
        //   this.chartObject.effects[collection]['mouseover'] = {};
        //   this.chartObject.effects[collection]['mouseout'] = {};
        // }
        //
        // console.log('this.chartObject.effects 2 = ', this.chartObject.effects);
        //
        // path.onmouseenter = null;
        // path.onmouseleave = null;
        // path.onmouseout = null;

        // console.log('path.style.stroke = ', path.style.stroke);
        //

        // path.onmouseenter =  (event) => {
        //
        //   console.log('event = ', event);
        //   console.log('mouseenter');
        //
        //   console.log('event.target.style.stroke = ', event.target.style.stroke);
        //
        //   event.target.style.stroke = '000';
        //
        // };
        // path.onmouseleave = () => {
        //   console.log('mouseleave')
        // };
        // path.onmouseover =  (event) => {
        //
        //   console.log('event = ', event);
        //   console.log('mouseover');
        //   console.log('event.target.style.stroke = ', event.target.style.stroke);
        //
        //   event.target.style.stroke = '000';
        // };

        let values: any = collections[i]
          .getElementsByTagName('text');
        for (let j = 0; j < values.length; j++) {
          let value: any = values[j];
          let x: any = Math.floor(value.x.animVal[0].value);
          let y: any = Math.floor(value.y.animVal[0].value);
          let dx: any = Math.floor(value.dx.animVal[0].value);
          let dy: any = Math.floor(value.dy.animVal[0].value);
          value.setAttribute('transform', `rotate(-30 ${x+dx} ${y+dy})`);
          value.style.fontSize = '17';
          value.style.textAnchor = 'start';
        }
      }
    }
  }
  private formatVertAxis(vertAxis: any) : void {
    let ticks: any = vertAxis
      .getElementsByTagName('g')[0]
      .getElementsByClassName('tick');
    for (let i = 0; i < ticks.length; i++) {
      let label = ticks[i].getElementsByTagName('text')[0];
      label.style.fontSize = '20';
    }
  }
  // Format legend and return extra height dy to be added to the frame (dy > 0
  // if the legend has more than one element)
  private formatLegend(legendElements: any) : number {
    let dy: number;
    for (let i = 0; i < legendElements.length; i++) {
      dy = 30 * i;
      legendElements[i].setAttribute('transform', `translate(0,${dy})`);
      legendElements[i].getElementsByTagName('rect')[0]
        .setAttribute('height', '20');
      legendElements[i].getElementsByTagName('rect')[0]
        .setAttribute('width', '20');
      legendElements[i].getElementsByTagName('text')[0]
        .setAttribute('dx', '25');
      legendElements[i].getElementsByTagName('text')[0]
        .setAttribute('dy', '0.85em');
      legendElements[i].getElementsByTagName('text')[0]
        .style.fontSize = '23';
    }
    return dy;
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
        'id', chartContainerId
    );
  }
  /*
   Merge input properties received, overriding the properties defined using the
   uvCharts API with the corresponding properties defined using the iAlepNg2InputChart
   interface. Define CSS selector for the chart container.
   Copy caption and subcaption data and take them out of the influence of the
   uvCHarts API.
   * */
  private processInputs(
      inputConfig: Object, inputGraphDef: Object, inputType: string,
      inputChart: iChart, chartContainerId: number
  ) : void {
    // Copy properties defined with uvCharts API
    for (let prop in inputConfig) {
      this.finalConfig[prop] = inputConfig[prop];
    }
    for (let prop in inputGraphDef) {
      this.finalGraphDef[prop] = inputGraphDef[prop];
    }
    this.finalType = inputType;
    // Absorb properties defined with iAlepNg2InputChart interface
    if (inputChart) {
      // Override Type
      this.finalType = inputChart.type;
      // Override graphDef
      this.finalGraphDef['categories'] = [];
      this.finalGraphDef['dataset'] = {};
      for (let collection of inputChart.collections) {
        this.finalGraphDef['categories'].push(collection.dataSet.field);
        this.finalGraphDef['dataset'][collection.dataSet.field] =[];
        for (let label in collection.dataSet.dataPoints) {
          this.finalGraphDef['dataset'][collection.dataSet.field].push(
              {
                name: label,
                value: collection.dataSet.dataPoints[label]
              }
          );
        }
      }
      // Override config
      this.finalConfig['meta']['caption'] = inputChart.title;
      this.finalConfig['meta']['hlabel'] = inputChart.hAxisLabel;
      this.finalConfig['meta']['subcaption'] = inputChart.subtitle;
      this.finalConfig['meta']['vlabel'] = inputChart.vAxisLabel;
    }
    // Define chart container by using CSS selector
    this.finalConfig['meta']['position'] =
        '.alep-ng2-chart-container[id="' + chartContainerId + '"]';
    // Export caption and subcaption data and remove them from the influence of
    // the uvCHarts API
    this.caption = this.finalConfig['meta']['caption'];
    this.finalConfig['meta']['caption'] = '';
    this.subCaption = this.finalConfig['meta']['subcaption'];
    this.finalConfig['meta']['subcaption'] = '';
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
    delete this.chartObject;
    let parent: HTMLElement = this.alepNg2ChartContainerChild.nativeElement;
    let child: HTMLElement = parent.getElementsByTagName('div')[0];
    parent.removeChild(child);
    this.buildChart();
  }
}
