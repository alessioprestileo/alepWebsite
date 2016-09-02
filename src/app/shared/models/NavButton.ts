export class NavButton {
  label: string;
  link: string[];

  constructor(label: string = null, link: string[] = null) {
    this.label = label;
    this.link = link;
  }

  public createCopy() : NavButton {
    let copy : NavButton = new NavButton();
    copy.label = this.label;
    let length: number = this.link.length;
    copy.link = [];
    for (let i = 0; i < length; i++) {
      copy.link[i] = this.link[i];
    }
    return copy;
  }
}
