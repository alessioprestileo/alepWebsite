import {Component, Input, Output, EventEmitter, ElementRef, ViewChild} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: "app-modal",
  styleUrls: ['modal.component.css'],
  templateUrl: 'modal.component.html',
})
export class ModalComponent {
  @Input() modalClass: string;
  @Input() closeOnEscape: boolean = true;
  @Input() closeOnOutsideClick: boolean = false;
  @Input() hasHeader: boolean = false;
  @Input() hasFooter: boolean = false;
  @Input() title: string;
  @Input() hideCloseButton = false;
  @Input() cancelButtonLabel: string;
  @Input() submitButtonLabel: string;
  @Output() onOpen = new EventEmitter(false);
  @Output() onClose = new EventEmitter(false);
  @Output() onSubmit = new EventEmitter(false);

  @ViewChild("modalRoot") private modalRoot: ElementRef;

  public isOpened = false;
  private backdropElement: HTMLElement;

  constructor() {
    this.createBackDrop();
  }
  ngOnDestroy() {
    if (this.backdropElement && this.backdropElement.parentNode === document.body)
      document.body.removeChild(this.backdropElement);
  }

  public open(...args: any[]) {
    if (this.isOpened)
      return;
    this.isOpened = true;
    this.onOpen.emit(args);
    document.body.appendChild(this.backdropElement);
    window.setTimeout(() => this.modalRoot.nativeElement.focus(), 0);
  }
  public close(...args: any[]) {
    if (!this.isOpened)
      return;
    this.isOpened = false;
    this.onClose.emit(args);
    document.body.removeChild(this.backdropElement);
  }
  private preventClosing(event: MouseEvent) {
    event.stopPropagation();
  }
  private createBackDrop() {
    this.backdropElement = document.createElement("div");
    this.backdropElement.classList.add("app-modal-backdrop");
    this.backdropElement.classList.add("fade");
    this.backdropElement.classList.add("in");
  }
}
