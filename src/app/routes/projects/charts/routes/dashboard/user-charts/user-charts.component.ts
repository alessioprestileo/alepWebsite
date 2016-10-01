import {
  Component, EventEmitter, HostListener, OnDestroy, OnInit, Inject
} from '@angular/core';

import { Subscription }   from 'rxjs/Rx';

import { Chart } from '../../../../../../shared/models/Chart'
import { ChartSrc_UserData } from "../../../../../../shared/models/ChartSrc_UserData";
import { AppRoutingService } from '../../../../../../shared/services/app-routing.service'
import { HeaderEntry, TableInput } from '../../../../../../shared/models/table-input-classes'
import { UserDataService } from '../../../../../../shared/services/user-data.service'

@Component({
  // moduleId: module.id,
  selector: 'app-user-charts',
  templateUrl: 'user-charts.component.html',
  styleUrls: ['user-charts.component.css'],
})
export class UserChartsComponent implements OnDestroy, OnInit {
  @HostListener('window:resize', ['$event'])
  private onResize(event: any) {
    this.emOnResize.emit();
  }
  private collapseTable: boolean = false;
  private charts: Chart[];
  private isMobile: boolean;
  private subOnResize: Subscription;
  private emOnResize: EventEmitter<any> = new EventEmitter();
  private tableInput: TableInput;
  private wasMobile: boolean;

  constructor(
    @Inject('ROUTES_DICT') private ROUTES_DICT,
    private appRoutingService: AppRoutingService,
    private userDataService: UserDataService
  ) {
  }

  ngOnInit() {
    this.subOnResize = this.emOnResize.subscribe(
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
      '/' + this.ROUTES_DICT.PROJECTS +
      '/' + this.ROUTES_DICT.CHARTS +
      '/' + this.ROUTES_DICT.CHARTS_DETAIL,
      'New'
    ];
    this.appRoutingService.navigate(link);
  }
  public onTableEdit(chart: Chart) : void {
    let id: string = chart.id.toString();
    let link: string[] = [
      '/' + this.ROUTES_DICT.PROJECTS +
      '/' + this.ROUTES_DICT.CHARTS +
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
          this.charts.push(chart);
          let chartSrc: ChartSrc_UserData = src[i];
          chart.importPropsFromSrc_UserData(chartSrc, this.userDataService);
        }
        this.checkMobileAndBuildTableInput();
      }
    );
  }
  private updateTableInput() : void {
    this.tableInput.items = this.charts;
  }
}
