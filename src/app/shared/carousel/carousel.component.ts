import {
  AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, DoCheck,
  ElementRef, EventEmitter, Input, OnInit, Output, ViewChild,
} from '@angular/core';

import { CarouselSlide } from '../models/CarouselSlide'
import { appRound } from '../appFunctions'

declare var jQuery: any;

var counter: number = 0;


@Component({
  moduleId: module.id,
  selector: 'app-carousel',
  templateUrl: 'carousel.component.html',
  styleUrls: ['carousel.component.css']
})
export class CarouselComponent implements AfterViewChecked,
                                          AfterViewInit, DoCheck, OnInit {
  @Input() private slides: CarouselSlide[];
  @Output() slideClickedEmitter: EventEmitter<any> = new EventEmitter();
  @ViewChild("carousel") private carousel: ElementRef;

  private maxSlideHeight: number = 0;
  private previousTransforms: string[];

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
  }
  ngAfterViewChecked() {
    this.onResize();
  }
  ngAfterViewInit() {
    this.initializeCarousel();
  }
  ngDoCheck() {
    if (counter === 0) {
      this.onResize();

      console.log('called from docheck');

    }
  }

  private alignSlideVertically(index, element, maxSlideHeight, currentTransform) : void {
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

      counter++;
      console.log('counter = ', counter);

      jQuery(element).css({
        'transform': transformation
      });
    }
    if (counter === 0) {
      this.changeDetectorRef.detectChanges();

      console.log('detecting');

    }
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
  private initializePreviousTransforms() : void {
    this.previousTransforms = [];
    let length = this.slides.length * 2; // include the clones
    for (let i = 0; i < length; i++) {
      this.previousTransforms[i] = 'none';
    }
  }
  private setMaxSlideHeight(index, element) : void {

    console.log('slide ', index, jQuery(element).height());

    // this.maxSlideHeight = 0;
    let height: number = jQuery(element).height();
    if (height > this.maxSlideHeight) {
      this.maxSlideHeight = height;
    }
  }
  public onResize() : void {
    let maxSlideHeight: number = 0;
    let currentTransform: string;
    jQuery(this.carousel.nativeElement).find('.slick-slide').each(
      // (index, element) => this.setMaxSlideHeight(index, element));
      (index, element) => {
        let height: number = jQuery(element).height();
        if (height > maxSlideHeight) {
          maxSlideHeight = height;
        }
      }
    );
    jQuery(this.carousel.nativeElement).find('.slick-slide').each(
      (index, element) => {
        currentTransform = jQuery(element).css('transform');
        this.alignSlideVertically(index, element, maxSlideHeight,
                                  currentTransform);
      }
    );

  }
  public onSlideClicked(link: string[]) : void {
    this.slideClickedEmitter.emit(link);
  }
}
