import { DetailPopupComponent } from './detail-popup/detail-popup.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { take } from 'rxjs/operators';
import { PersonService, IPerson } from '../services/person.service';
import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate, group, animation } from '@angular/animations';
import { ReloadEmitterService } from '../services/reloadEmitter.service';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.css'],
  animations: [
    trigger('slideInOut', [
        state('in', style({
            'max-height': '500px', opacity: '1', visibility: 'visible'
        })),
        state('out', style({
            'max-height': '0px', opacity: '0', visibility: 'hidden'
        })),
        transition('in => out', [group([
            animate('400ms ease-in-out', style({
                opacity: '0'
            })),
            animate('600ms ease-in-out', style({
                'max-height': '0px'
            })),
            animate('700ms ease-in-out', style({
                visibility: 'hidden'
            }))
        ]
        )]),
        transition('out => in', [group([
            animate('1ms ease-in-out', style({
                visibility: 'visible'
            })),
            animate('600ms ease-in-out', style({
                'max-height': '500px'
            })),
            animate('800ms ease-in-out', style({
                opacity: '1'
            }))
        ]
        )])
    ]),
  ]
})
export class SearchListComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'progress', 'hitability', 'status', 'options'];
  dataSource: IPerson[];
  animationState = 'in';
  showTable = true;
  constructor(private personService: PersonService, private dialog: MatDialog, private reload: ReloadEmitterService) { }

  ngOnInit() {
    this.getPeople();
    this.reload.event.subscribe(() => {
      this.getPeople();
    });
  }

  getPeople() {
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

  generateReport(personId: string) {
    this.personService.generateReport(personId).subscribe((person) => {
      this.getPeople();
    });
  }

  public findHitability(person: IPerson) {
    const status = person.status;
    const progress = this.findProgress(person);
    let length = 0;
    let sucess = 0;

    Object.keys(status).forEach(key => {
      if (status[key] !== 'starting' || progress === 100) {
        length++;
      }
      if (status[key] === 'finished') {
        sucess++;
      }
    });

    return (sucess * 100) / length;
  }

  public findProgress(person: IPerson) {
    const status = person.status;
    let length = 0;
    let done = 0;

    if ((new Date().getTime() - person.createdAt) > 90000) {
      return 100;
    }

    Object.keys(status).forEach(key => {
      length++;
      if (status[key] !== 'starting') {
        done++;
      }
    });

    return (done * 100) / length;
  }

  public getStatusText(person: IPerson) {
    if (this.findProgress(person) !== 100) {
      return 'Em progresso';
    } else {
      return 'Finalizado';
    }
  }

  public getStatusColor(person: IPerson) {
    const hitability = this.findHitability(person);

    if (hitability >= 75) {
      return 'badge-success';
    } else if (hitability >= 40) {
      return 'badge-warn';
    } else {
      return 'badge-error';
    }
  }

  public showDetail(person: IPerson) {
    const title = 'Detalhes da pesquisa';
    const dialogRef: MatDialogRef<any> = this.dialog.open(DetailPopupComponent, {
      width: '350px',
      disableClose: true,
      data: {
        title
      }
    });

    dialogRef.afterClosed()
    .subscribe(res => {
    });
  }

  public toggleTable() {
    this.showTable = !this.showTable;
    this.animationState = this.showTable ? 'in' : 'out';
  }
}
