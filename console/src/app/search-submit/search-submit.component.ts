import { Component, OnInit } from '@angular/core';
import { PersonService, IPerson } from '../search-list/services/person.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as join from 'lodash/join';

@Component({
  selector: 'app-search-submit',
  templateUrl: './search-submit.component.html',
  styleUrls: ['./search-submit.component.css']
})
export class SearchSubmitComponent implements OnInit {
  showForm = true;
  form: FormGroup;
  selectValue: string[] = ['A1A2C1C2C3C4E1G1I1I2J1M1S1S2'];
  constructor(private personService: PersonService) { }

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
    this.personService.addPeople(person).subscribe((res) => {
      this.form.reset();
      this.form.markAsUntouched();
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
  }
}
