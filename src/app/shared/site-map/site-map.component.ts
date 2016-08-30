import {Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-site-map',
  templateUrl: 'site-map.component.html',
  styleUrls: ['site-map.component.css']
})
export class SiteMapComponent implements OnInit {
  @Input() private labels: string[];
  @Input() private links: string[][];
  @Output() navEmitter: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {
  }

  public onSelected(index: number) : void {
    this.navEmitter.emit(this.links[index]);
  }
}
