import { take } from 'rxjs/operators';
import { PersonService, IPerson } from './services/person.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.css']
})
export class SearchListComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'progress', 'hitability', 'status', 'options'];
  dataSource: IPerson[];
  showTable = true;
  constructor(private personService: PersonService) { }

  ngOnInit() {
    this.personService.getPeople().pipe(take(1)).subscribe(people => {
      this.dataSource = people;

      let i = 1;

      for (const person of this.dataSource) {
        // tslint:disable-next-line: no-string-literal
        person['position'] = i;
        i++;
      }
    });
  }

  public findHitability(status: any) {
    let length = 0;
    let sucess = 0;

    Object.keys(status).forEach(key => {
      length++;
      if (status[key]) {
        sucess++;
      }
    });

    return (sucess * 100) / length;
  }

  public findProgress(status: any) {
    let length = 0;
    let done = 0;

    Object.keys(status).forEach(key => {
      length++;
      if (status[key] !== undefined) {
        done++;
      }
    });

    return (done * 100) / length;
  }

  public getStatusText(status: any) {
    if (this.findProgress(status) !== 100) {
      return 'Em progresso';
    } else {
      return 'Finalizado';
    }
  }

  public getStatusColor(status: any) {
    if (this.findProgress(status) !== 100) {
      return 'badge-primary';
    } else {
      const hitability = this.findHitability(status);

      if (hitability >= 75) {
        return 'badge-success';
      } else if (hitability >= 40) {
        return 'badge-warn';
      } else {
        return 'badge-error';
      }
    }
  }

  public toggleTable() {
    this.showTable = !this.showTable;
  }
}
