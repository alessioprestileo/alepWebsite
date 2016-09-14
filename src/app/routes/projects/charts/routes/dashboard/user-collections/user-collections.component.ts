import {
  Component, EventEmitter, HostListener, OnDestroy, OnInit, Inject
} from '@angular/core';

import { Subscription }   from 'rxjs/Rx';

import { AppChartCollection } from '../../../../../../shared/models/AppChartCollection'
import { AppRoutingService } from '../../../../../../shared/services/app-routing.service'
import { DataTableComponent } from "../../../../../../shared/data-table/data-table.component";
import { HeaderEntry, TableInput } from '../../../../../../shared/models/table-input'
import { UserDataService } from '../../../../../../shared/services/user-data.service'

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
    this.onResizeEmitter.emit();
  }

  private collapseTable: boolean = false;
  private collections: AppChartCollection[];
  private isMobile: boolean;
  private subOnResize: Subscription;
  private onResizeEmitter: EventEmitter<any> = new EventEmitter();
  private tableInput: TableInput;
  private wasMobile: boolean;

  constructor(
    @Inject('ROUTES_DICT') private ROUTES_DICT,
    private appRoutingService: AppRoutingService,
    private userDataService: UserDataService
  ) {}

  ngOnInit() {
    this.subOnResize = this.onResizeEmitter.subscribe(
      () => this.checkMobileAndBuildTableInput()
    );
    this.userDataService.getAll('collections').then(
      collections => {
        this.collections = (<AppChartCollection[]>collections);
        this.checkMobileAndBuildTableInput();
      }
    );
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
      this.ROUTES_DICT.COLLECTIONS_DETAIL,
      'New'
    ];
    this.appRoutingService.navigate(link);
  }
  public onTableEdit(collection: AppChartCollection) : void {
    let id: string = collection.id.toString();
    let link: string[] = [
      this.ROUTES_DICT.COLLECTIONS_DETAIL,
      id
    ];
    this.appRoutingService.navigate(link);
  }
  public onTableRemove(collection: AppChartCollection) : void {
    this.userDataService.deleteItem('collections', collection.id).then(
      () => {
        this.collections = this.collections.filter(
          c => c.id !== collection.id
        );
        this.updateTableInput();
      }
    );
  }
  private updateTableInput() : void {
    this.tableInput.items = this.collections;
  }
}
