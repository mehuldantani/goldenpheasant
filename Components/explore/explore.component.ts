import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

  @Input() user;
  constructor() { }

  ngOnInit(): void {
  }

}
