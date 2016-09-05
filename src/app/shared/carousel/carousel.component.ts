import {
  AfterViewInit, Component, DoCheck, EventEmitter,
  ElementRef , Input, OnDestroy, OnInit, Output, ViewChild,
} from '@angular/core';

import {Subscription, BehaviorSubject}   from 'rxjs/Rx';

import { CarouselSlide } from '../models/CarouselSlide'
import { appRound } from '../appFunctions'

declare var jQuery: any;

let onResizeEmitter: EventEmitter<any> = new EventEmitter();

@Component({
  moduleId: module.id,
  selector: 'app-carousel',
  templateUrl: 'carousel.component.html',
  styleUrls: ['carousel.component.css']
})
export class CarouselComponent implements AfterViewInit,
                                          DoCheck,
                                          OnDestroy,
                                          OnInit {
  @Input() private slides: CarouselSlide[];
  @Output() slideClickedEmitter: EventEmitter<any> = new EventEmitter();
  @ViewChild("carousel") private carousel: ElementRef;

  private obMaxSlideHeight: BehaviorSubject<number>;
  private prevMaxSlideHeight: number = 0;
  private subMaxSlideHeight: Subscription;
  private subOnResize: Subscription;

  constructor() {}

  ngOnInit() {
    this.initMaxSlideHeight();
    window.onresize = this.onResize;
    this.subOnResize = onResizeEmitter.subscribe(
      () => this.updateMaxSlideHeight()
    );
    this.subMaxSlideHeight = this.obMaxSlideHeight.subscribe(
      (height: number) => this.alignSlidesVertically(height)
    );
  }
  ngOnDestroy() {
    this.cancelSubs();
  }
  ngAfterViewInit() {
    this.initCarousel();
    this.updateMaxSlideHeight();
  }
  ngDoCheck() {
  }

  private alignSlideVertically(
    index: number,
    element: HTMLElement,
    maxSlideHeight: number,
    currentTransform: string
  ) : void {
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
      jQuery(element).css({
        'transform': transformation
      });
    }
  }
  private alignSlidesVertically(maxSlideHeight: number) : void {
    let currentTransform: string;
    jQuery(this.carousel.nativeElement).find('.app-slideContainer').each(
      (index, element) => {
        currentTransform = jQuery(element).css('transform');
        this.alignSlideVertically(
          index, element, maxSlideHeight, currentTransform
        );
      }
    );
  }
  private cancelSubs() : void {
    this.subMaxSlideHeight.unsubscribe();
    this.subOnResize.unsubscribe();
  }
  private initCarousel() : void {
    jQuery(this.carousel.nativeElement).slick({
      dots: true
    });
    jQuery(this.carousel.nativeElement).find('.single-item').slick();
    jQuery(this.carousel.nativeElement).find('.slick-slide').css(
      'outline', 'none'
    );
  }
  private initMaxSlideHeight() : void {
    let maxSlideHeight: number = 0;
    jQuery(this.carousel.nativeElement).find('.app-slideContainer').each(
      (index, element) => {
        let height: number = jQuery(element).height();
        if (height > maxSlideHeight) {
          maxSlideHeight = height;
        }
      }
    );
    this.prevMaxSlideHeight = maxSlideHeight;
    this.obMaxSlideHeight = new BehaviorSubject(maxSlideHeight);
  }
  public onResize() : void {
    onResizeEmitter.emit();
  }
  public onSlideClicked(link: string[]) : void {
    this.slideClickedEmitter.emit(link);
  }
  private updateMaxSlideHeight() : void {
    let maxSlideHeight: number = 0;
    let deltaTime: number = 100;
    let elapsedTime: number = 0;
    let heightInterval: number = setInterval(() => {
      jQuery(this.carousel.nativeElement).find('.app-slideContainer').each(
        (index, element) => {
          let height: number = jQuery(element).height();
          if (height > maxSlideHeight) {
            maxSlideHeight = height;
          }
        }
      );
      elapsedTime += deltaTime;
      if (elapsedTime > 500 || maxSlideHeight !== this.prevMaxSlideHeight) {
        this.prevMaxSlideHeight = maxSlideHeight;
        this.obMaxSlideHeight.next(maxSlideHeight);
        clearInterval(heightInterval);
      }
    }, deltaTime);
  }
}
