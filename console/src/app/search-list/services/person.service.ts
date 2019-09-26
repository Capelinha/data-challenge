import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const endpoint = `https://1bicm7p4oc.execute-api.us-east-1.amazonaws.com/dev`;

export interface IPerson {
  personId: string;
  firstName: string;
  lastName: string;
  uidCreated: number;
  rg: string;
  cpf: string;
  cnpj: string;
  searchPages: string;
  createdAt: number;
  status: any;
}

@Injectable()
export class PersonService {
  constructor(private http: HttpClient) {}

  addPeople(person: IPerson): Observable<IPerson[]> {
    return this.http.post<IPerson[]>(`${endpoint}/person`, person);
  }

  getPeople(): Observable<IPerson[]> {
    return this.http.get<IPerson[]>(`${endpoint}/person`);
  }

}
