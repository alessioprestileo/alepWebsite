import {
  Component, EventEmitter, HostListener, OnDestroy, OnInit, Inject
} from '@angular/core';

import { Subscription }   from 'rxjs/Rx';

import { ChartColl } from '../../../../../../shared/models/ChartColl'
import { ChartCollSrc_UserData } from "../../../../../../shared/models/ChartCollSrc_UserData";
import { AppRoutingService } from '../../../../../../shared/services/app-routing.service'
import { DataTableComponent } from "../../../../../../shared/data-table/data-table.component";
import { HeaderEntry, TableInput } from '../../../../../../shared/models/table-input-classes'
import { UserDataService } from '../../../../../../shared/services/user-data.service'
import {ChartSrc_UserData} from "../../../../../../shared/models/ChartSrc_UserData";

@Component({
  moduleId: module.id,
  selector: 'app-user-collections',
  templateUrl: 'user-collections.component.html',
  styleUrls: ['user-collections.component.css'],
  directives: [DataTableComponent]
})
export class UserCollectionsComponent implements OnDestroy, OnInit {
  @HostListener('window:resize', ['$event'])
  private onResize(event: any) {
    this.emOnResize.emit();
  }
  private collapseTable: boolean = false;
  private collections: ChartColl[];
  private emOnResize: EventEmitter<any> = new EventEmitter();
  private isMobile: boolean;
  private subOnResize: Subscription;
  private tableInput: TableInput;
  private wasMobile: boolean;

  constructor(
    @Inject('ROUTES_DICT') private ROUTES_DICT,
    private appRoutingService: AppRoutingService,
    private userDataService: UserDataService
  ) {}

  ngOnInit() {
    this.subOnResize = this.emOnResize.subscribe(
      () => this.checkMobileAndBuildTableInput()
    );
    this.setCollections();
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
    this.tableInput = new TableInput(headers, this.collections);
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
  public onNewCollection() {
    let link: string[] = [
      '/' + this.ROUTES_DICT.PROJECTS +
      '/' + this.ROUTES_DICT.CHARTS +
      '/' + this.ROUTES_DICT.COLLECTIONS_DETAIL,
      'New'
    ];
    this.appRoutingService.navigate(link);
  }
  public onTableEdit(collection: ChartColl) : void {
    let id: string = collection.id.toString();
    let link: string[] = [
      '/' + this.ROUTES_DICT.PROJECTS +
      '/' + this.ROUTES_DICT.CHARTS +
      '/' + this.ROUTES_DICT.COLLECTIONS_DETAIL,
      id
    ];
    this.appRoutingService.navigate(link);
  }
  public onTableRemove(collection: ChartColl) : void {
    this.userDataService.getAll('charts').then(
      (charts) => {
        let dependentCharts: string = '';
        let chartsLength: number = charts.length;
        for (let i = 0; i < chartsLength; i++) {
          let chartSrc: ChartSrc_UserData = <ChartSrc_UserData>charts[i];
          let collectionsLength: number = chartSrc.collectionsIds.length;
          for (let j = 0; j < collectionsLength; j++) {
            if (chartSrc.collectionsIds[j] === collection.id) {
              dependentCharts += '"' + chartSrc.name + '"' + '\n';
            }
          }
        }
        if (dependentCharts) {
          alert('Collection "' + collection.name + '" can\'t be removed ' +
            'because it is needed by the following charts: \n' +
            dependentCharts);
        }
        else {
          this.userDataService.deleteItem('collections', collection.id).then(
            () => {
              this.collections = this.collections.filter(
                c => c.id !== collection.id
              );
              this.updateTableInput();
            }
          );
        }
      }
    );
  }
  private setCollections() : void {
    this.userDataService.getAll('collections').then(
      collections => {
        let src: ChartCollSrc_UserData[] =
          <ChartCollSrc_UserData[]>collections;
        this.collections = [];
        let length: number = src.length;
        for (let i = 0; i < length; i++) {
          let collection: ChartColl = new ChartColl();
          collection.importPropsFromSrc_UserData(src[i]);
          this.collections.push(collection);
        }
        this.checkMobileAndBuildTableInput();
      }
    );
  }
  private updateTableInput() : void {
    this.tableInput.items = this.collections;
  }
}
