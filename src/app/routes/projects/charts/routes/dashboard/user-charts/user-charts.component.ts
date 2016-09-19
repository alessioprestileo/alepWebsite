import {
  Component, EventEmitter, HostListener, OnDestroy, OnInit, Inject
} from '@angular/core';

import { Subscription }   from 'rxjs/Rx';

import { Chart } from '../../../../../../shared/models/Chart'
import { ChartColl } from "../../../../../../shared/models/ChartColl";
import { ChartCollSrc_UserData } from "../../../../../../shared/models/ChartCollSrc_UserData";
import { ChartSrc_UserData } from "../../../../../../shared/models/ChartSrc_UserData";
import { AppRoutingService } from '../../../../../../shared/services/app-routing.service'
import { DataTableComponent } from "../../../../../../shared/data-table/data-table.component";
import { HeaderEntry, TableInput } from '../../../../../../shared/models/table-input'
import { UserDataService } from '../../../../../../shared/services/user-data.service'

@Component({
  moduleId: module.id,
  selector: 'app-user-charts',
  templateUrl: 'user-charts.component.html',
  styleUrls: ['user-charts.component.css'],
  directives: [DataTableComponent]
})
export class UserChartsComponent implements OnDestroy, OnInit {
  @HostListener('window:resize', ['$event'])
  private onResize(event: any) {
    this.onResizeEmitter.emit();
  }
  private collapseTable: boolean = false;
  private charts: Chart[];
  private isMobile: boolean;
  private subOnResize: Subscription;
  private onResizeEmitter: EventEmitter<any> = new EventEmitter();
  private tableInput: TableInput;
  private wasMobile: boolean;

  constructor(
    @Inject('ROUTES_DICT') private ROUTES_DICT,
    private appRoutingService: AppRoutingService,
    private userDataService: UserDataService
  ) {
  }

  ngOnInit() {
    this.subOnResize = this.onResizeEmitter.subscribe(
      () => this.checkMobileAndBuildTableInput()
    );
    this.setCharts();
  }
  ngOnDestroy() {
    this.cancelSubs();
  }

  private buildTableInput(isMobile: boolean) : void {
    let headers: Array<HeaderEntry>;
    if (isMobile) {
      headers = [
        new HeaderEntry('Name', 'name')
      ];
    } else {
      headers = [
        new HeaderEntry('Id', 'id'),
        new HeaderEntry('Name', 'name'),
      ];
    }
    this.tableInput = new TableInput(headers, this.charts);
  }
  private cancelSubs() {
    this.subOnResize.unsubscribe();
  }
  private checkMobileAndBuildTableInput() : void {
    this.isMobile = (window.innerWidth < 768) ? true : false;
    if (this.wasMobile !== this.isMobile) {
      this.buildTableInput(this.isMobile);
      this.wasMobile = this.isMobile;
    }
  }
  public onNewChart() {
    let link: string[] = [
      '/' + this.ROUTES_DICT.CHARTS_DETAIL,
      'New'
    ];
    this.appRoutingService.navigate(link);
  }
  public onTableEdit(chart: Chart) : void {
    let id: string = chart.id.toString();
    let link: string[] = [
      '/' + this.ROUTES_DICT.CHARTS_DETAIL,
      id
    ];
    this.appRoutingService.navigate(link);
  }
  public onTableRemove(collection: Chart) : void {
    this.userDataService.deleteItem('charts', collection.id).then(
      () => {
        this.charts = this.charts.filter(
          c => c.id !== collection.id
        );
        this.updateTableInput();
      }
    );
  }
  private setCharts() : void {
    this.userDataService.getAll('charts').then(
      charts => {
        let src: ChartSrc_UserData[] =
          <ChartSrc_UserData[]>charts;
        this.charts = [];
        let chartsLength: number = src.length;
        for (let i = 0; i < chartsLength; i++) {
          let chart: Chart = new Chart();
          let chartSrc: ChartSrc_UserData = src[i];
          chart.importPropsFromSrc_UserData(chartSrc);
          let collectionsLength: number = chartSrc.collectionsIds.length;
          for (let j = 0; j < collectionsLength; j++) {
            this.userDataService
              .getItem('collections', chartSrc.collectionsIds[j])
              .then(collection => {
                let collSrc: ChartCollSrc_UserData =
                  <ChartCollSrc_UserData>collection;
                let newColl: ChartColl = new ChartColl();
                newColl.importPropsFromSrc_UserData(collSrc);
                chart.collections.push(newColl);
              });
          }
          this.charts.push(chart);
        }
        this.checkMobileAndBuildTableInput();
      }
    );
  }
  private updateTableInput() : void {
    this.tableInput.items = this.charts;
  }
}
