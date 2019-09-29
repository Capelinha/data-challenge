import { Component, OnInit, Output } from '@angular/core';
import { PersonService, IPerson } from '../services/person.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as join from 'lodash/join';
import { trigger, state, style, transition, animate, group } from '@angular/animations';
import { EventEmitter } from 'events';
import { ReloadEmitterService } from '../services/reloadEmitter.service';

@Component({
  selector: 'app-search-submit',
  templateUrl: './search-submit.component.html',
  styleUrls: ['./search-submit.component.css'],
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
export class SearchSubmitComponent implements OnInit {
  showForm = true;
  animationState = 'in';
  form: FormGroup;
  selectValue: string[] = ['A1A2C1C2C3C4E1G1I1I2J1M1S1S2'];
  constructor(private personService: PersonService, private reload: ReloadEmitterService) { }

  ngOnInit() {
    this.form = new FormGroup({
      firstName: new FormControl('', [ Validators.required ]),
      lastName: new FormControl('', [ Validators.required ]),
      rg: new FormControl('', [ Validators.required ]),
      cpf: new FormControl('', [ Validators.required, Validators.pattern('[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}')]),
      cnpj: new FormControl('', [ Validators.required ]),
      searchPages: new FormControl('', [ Validators.required ])
    });
  }

  public submit() {
    const person: IPerson = this.form.value;
    person.searchPages = join(person.searchPages, '');
    person.uidCreated = 'awfwafawfawfawf';
    this.personService.addPeople(person).subscribe((res) => {
      this.form.reset();
      this.form.markAsUntouched();
      this.reload.emit();
    },
    (err) => {
      console.log('error');
    });
  }

  public selectedAll(opt: boolean) {
    if (opt) {
      this.selectValue = ['A1A2C1C2C3C4E1G1I1I2J1M1S1S2'];
    } else {
      this.selectValue = this.selectValue.filter((s) => s.length === 2);
    }
  }

  public toggleForm() {
    this.showForm = !this.showForm;
    this.animationState = this.showForm ? 'in' : 'out';
  }
}
