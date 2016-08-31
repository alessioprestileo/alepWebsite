import {Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare var jQuery: any;

@Component({
  moduleId: module.id,
  selector: 'app-carousel',
  templateUrl: 'carousel.component.html',
  styleUrls: ['carousel.component.css']
})
export class CarouselComponent implements OnInit {
  @ViewChild("carousel") private carousel: ElementRef;

  constructor() {}

  ngOnInit() {
      jQuery(this.carousel.nativeElement).slick({
        dots: true
      });
    jQuery(this.carousel.nativeElement).find('.single-item').slick();

  }

}
