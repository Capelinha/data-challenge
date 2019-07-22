import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const endpoint = `https://1bicm7p4oc.execute-api.us-east-1.amazonaws.com/dev`;

export interface IPerson {
  personId: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  uidCreated: number;
  rg: string;
  cpf: string;
  cnpj: string;
  searchPages: string;
  phoneNumber: string;
  createdAt: number;
  status: {
      consultaSocio: boolean;
      escavador: boolean;
      google: boolean;
      jucesp: boolean;
      sivec: boolean
  };
}

@Injectable()
export class PersonService {
  constructor(private http: HttpClient) {}

  getPeople(): Observable<IPerson[]> {
    return this.http.get<IPerson[]>(`${endpoint}/person`);
  }

}
