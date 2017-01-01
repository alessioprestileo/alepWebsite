import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-cv',
  templateUrl: './my-cv.component.html',
  styleUrls: ['./my-cv.component.css']
})
export class MyCvComponent implements OnInit {

  constructor(
  ) {}

  ngOnInit() {
  }

  public onCvEngClicked() : void {
    window.location.assign('https://drive.google.com/file/d/0B5fpN0QiKMiDSU1WYVZTamVSM28/view?usp=sharing');
  }
}
