export class CarouselSlide {
  imgUrl: string;
  label: string;
  link: string[];

  constructor(imgUrl: string = null,
              label: string = null,
              link: string[] = null) {
    this.imgUrl = imgUrl;
    this.label = label;
    this.link = link;
  }

  public createCopy() : CarouselSlide {
    let copy : CarouselSlide = new CarouselSlide();
    copy.imgUrl = this.imgUrl;
    copy.label = this.label;
    let length: number = this.link.length;
    copy.link = [];
    for (let i = 0; i < length; i++) {
      copy.link[i] = this.link[i];
    }
    return copy;
  }
}
