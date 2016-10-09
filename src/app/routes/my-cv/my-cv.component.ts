import { Component, OnInit } from '@angular/core';

@Component({
  // moduleId: module.id,
  selector: 'app-my-cv',
  templateUrl: 'my-cv.component.html',
  styleUrls: ['my-cv.component.css']
})
export class MyCvComponent implements OnInit {

  constructor(
  ) {}

  ngOnInit() {
    window.location.replace('https://drive.google.com/file/d/0B5fpN0QiKMiDb0JmejAwUjhiWWc/view?usp=sharing');
  }

}
