import { Component, OnInit } from '@angular/core';

import { iChart } from 'alep-ng2-chart/dist/models/iChart'

@Component({
  selector: 'app-samples',
  templateUrl: 'samples.component.html',
  styleUrls: ['samples.component.css']
})
export class SamplesComponent implements OnInit {
  private barChartObject: iChart;
  private donutChartObject: iChart;
  private lineChartObject: iChart;
  private pieChartObject: iChart;
  private polarAreaChartObject: iChart;

  constructor() {}

  ngOnInit() {
    this.setBarChartObject();
    this.setDonutChartObject();
    this.setLineChartObject();
    this.setPieChartObject();
    this.setPolarAreaChartObject()
  }

  private setBarChartObject() : void {
    this.barChartObject = {
      collections: [
        {
          dataSet: {
            dataPoints: {
              '2008': 15,
              '2009': 28,
              '2010': 42,
              '2011': 88,
              '2012': 100,
              '2013': 143
            },
            field: 'Series 1',
            ticker: 'Sales Data'
          },
          id: 1,
          name: 'Collection_1'
        },
        {
          dataSet: {
            dataPoints: {
              '2008': 15 * 1.2,
              '2009': 28 * 1.2,
              '2010': 42 * 1.2,
              '2011': 88 * 1.2,
              '2012': 100 * 1.2,
              '2013': 143 * 1.2
            },
            field: 'Series 2',
            ticker: 'Sales Data'
          },
          id: 2,
          name: 'Collection_2'
        }
      ],
      hAxisLabel: 'X Axis',
      id: 1,
      name: 'Chart_1',
      title: 'Title',
      subTitle: 'Subtitle',
      type: 'Bar',
      vAxisLabel: 'Y axis'
    }
  }
  private setDonutChartObject() : void {
    this.donutChartObject = {
      collections: [
        {
          dataSet: {
            dataPoints: {
              'Download Sales': 350,
              'In-Store Sales': 450,
              'Mail-Order Sales': 100
            },
            field: 'Series 1',
            ticker: 'Sales Data'
          },
          id: 1,
          name: 'Collection_1'
        },
      ],
      hAxisLabel: 'X Axis',
      id: 1,
      name: 'Chart_1',
      title: 'Title',
      subTitle: 'Subtitle',
      type: 'Donut',
      vAxisLabel: 'Y axis'
    }
  }
  private setLineChartObject() : void {
    this.lineChartObject = {
      collections: [
        {
          dataSet: {
            dataPoints: {
              'January': 65,
              'February': 59,
              'March': 80,
              'April': 81,
              'May': 56,
              'June': 55,
              'July': 40
            },
            field: 'Series A',
            ticker: 'Sales Data'
          },
          id: 1,
          name: 'Collection_1'
        },
        {
          dataSet: {
            dataPoints: {
              'January': 28,
              'February': 48,
              'March': 40,
              'April': 19,
              'May': 66,
              'June': 27,
              'July': 90
            },
            field: 'Series B',
            ticker: 'Sales Data'
          },
          id: 2,
          name: 'Collection_2'
        },
        {
          dataSet: {
            dataPoints: {
              'January': 18,
              'February': 48,
              'March': 77,
              'April': 9,
              'May': 100,
              'June': 27,
              'July': 40
            },
            field: 'Series C',
            ticker: 'Sales Data'
          },
          id: 3,
          name: 'Collection_3'
        }
      ],
      hAxisLabel: 'X Axis',
      id: 1,
      name: 'Chart_1',
      title: 'Title',
      subTitle: 'Subtitle',
      type: 'Line',
      vAxisLabel: 'Y axis'
    }
  }
  private setPieChartObject() : void {
    this.pieChartObject = {
      collections: [
        {
          dataSet: {
            dataPoints: {
              'Download Sales': 350,
              'In-Store Sales': 450,
              'Mail-Order Sales': 100
            },
            field: 'Series 1',
            ticker: 'Sales Data'
          },
          id: 1,
          name: 'Collection_1'
        },
      ],
      hAxisLabel: 'X Axis',
      id: 1,
      name: 'Chart_1',
      title: 'Title',
      subTitle: 'Subtitle',
      type: 'Pie',
      vAxisLabel: 'Y axis'
    }
  }
  private setPolarAreaChartObject() : void {
    this.polarAreaChartObject = {
      collections: [
        {
          dataSet: {
            dataPoints: {
              'Download Sales': 350,
              'In-Store Sales': 450,
              'Mail-Order Sales': 100,
              'Telesales': 40,
              'Corporate Sales': 120
            },
            field: 'Series 1',
            ticker: 'Sales Data'
          },
          id: 1,
          name: 'Collection_1'
        },
      ],
      hAxisLabel: 'X Axis',
      id: 1,
      name: 'Chart_1',
      title: 'Title',
      subTitle: 'Subtitle',
      type: 'Pie',
      vAxisLabel: 'Y axis'
    }
  }
}
