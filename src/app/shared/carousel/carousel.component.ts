import {
  AfterViewInit, Component, DoCheck, ElementRef,
  EventEmitter, Input, OnInit, Output, ViewChild,
} from '@angular/core';

import { CarouselSlide } from '../models/CarouselSlide'
import { appRound } from '../appFunctions'

declare var jQuery: any;

@Component({
  moduleId: module.id,
  selector: 'app-carousel',
  templateUrl: 'carousel.component.html',
  styleUrls: ['carousel.component.css']
})
export class CarouselComponent implements AfterViewInit, DoCheck, OnInit {
  @Input() private slides: CarouselSlide[];
  @Output() slideClickedEmitter: EventEmitter<any> = new EventEmitter();
  @ViewChild("carousel") private carousel: ElementRef;

  private windowHeight: number;
  private windowWidth: number;

  constructor() {}

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.initializeCarousel();
    this.alignSlidesVertically();
  }
  ngDoCheck() {
    if (window.innerHeight !== this.windowHeight ||
        window.innerWidth !== this.windowWidth) {
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
      this.onResize();
    }
  }

  private alignSlideVertically(index, element,
                               maxSlideHeight, currentTransform) : boolean {
    let alignmentFlag: boolean = false;
    let deltaHeight: number = maxSlideHeight - jQuery(element).height();
    let nextTransformY: string = appRound(
      (deltaHeight / 2), 4
    ).toString();
    let currentTransformY: string;
    if (currentTransform.split(',').length === 6) {
      let length: number = currentTransform.split(',')[5].length;
      currentTransformY = currentTransform.split(',')[5].substring(
        1, length - 1
      );
    }
    if (deltaHeight !== 0 && nextTransformY !== currentTransformY) {
      let transformation: string = 'translateY(' + (deltaHeight / 2) + 'px)';
      alignmentFlag = true;
      jQuery(element).css({
        'transform': transformation
      });
    }
    return alignmentFlag;
  }
  private alignSlidesVertically() : void {
    let slidesAreAligned: boolean = false;
    let deltaTime: number = 10;
    let elapsedTime: number = 0;
    let alignmentInterval: number = setInterval(() => {
      if (slidesAreAligned || elapsedTime > 500) {
        clearInterval(alignmentInterval);
      }
      else {
        let maxSlideHeight: number = this.getMaxSlideHeight();
        let currentTransform: string;
        let alignmentFlag: boolean = false;
        jQuery(this.carousel.nativeElement).find('.slick-slide').each(
          (index, element) => {
            currentTransform = jQuery(element).css('transform');
            alignmentFlag = this.alignSlideVertically(
              index, element, maxSlideHeight, currentTransform
            );
            if (alignmentFlag) {
              slidesAreAligned = true;
            }
          }
        );
        elapsedTime += deltaTime;
      }
    }, deltaTime);
  }
  private getMaxSlideHeight() : number {
    let maxSlideHeight: number = 0;
    jQuery(this.carousel.nativeElement).find('.slick-slide').each(
      (index, element) => {
        let height: number = jQuery(element).height();
        if (height > maxSlideHeight) {
          maxSlideHeight = height;
        }
      }
    );
    return maxSlideHeight;
  }
  private initializeCarousel() : void {
    jQuery(this.carousel.nativeElement).slick({
      dots: true
    });
    jQuery(this.carousel.nativeElement).find('.single-item').slick();
    jQuery(this.carousel.nativeElement).find('.slick-slide').css(
      'outline', 'none'
    );
  }
  public onResize() : void {
    this.alignSlidesVertically();
  }
  public onSlideClicked(link: string[]) : void {
    this.slideClickedEmitter.emit(link);
  }
}
