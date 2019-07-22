import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-submit',
  templateUrl: './search-submit.component.html',
  styleUrls: ['./search-submit.component.css']
})
export class SearchSubmitComponent implements OnInit {
  showForm = true;
  constructor() { }

  ngOnInit() {
  }

  public toggleForm() {
    this.showForm = !this.showForm;
  }
}
