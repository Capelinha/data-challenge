import { JucespResult } from './../models/jucespResult';
import { GoogleResult } from './../models/googleResult';
import { EscavadorResult } from './../models/escavadorResult';
import { ConsultaSocioResult } from './../models/consultaSocioResult';
import { Person } from "../models/person";
import { AmDynamodbDataMapper } from "../repositories/dynamoDataMapper";
import { SivecResult } from '../models/sivecResult';

/**
 * Class middleware that execute business rules for person service.
 */
export class PersonService {
  private dataMapper: AmDynamodbDataMapper;
  constructor() {
    this.dataMapper = new AmDynamodbDataMapper();
  }

  public async createPerson(person: Person) {
    return this.dataMapper.put(person);
  }

  public async getPeople() {
    return Promise.all((await this.dataMapper.scan(Person)).map( async(person) => {
      const status = {};
      
      const consultaSocio = await this.dataMapper.query(ConsultaSocioResult, {personId: person.personId}, {indexName: 'personId-index'});
      status['consultaSocio'] = consultaSocio.length > 0;

      const escavador = await this.dataMapper.query(EscavadorResult, {personId: person.personId}, {indexName: 'personId-index'});
      status['escavador'] = escavador.length > 0;

      const google = await this.dataMapper.query(GoogleResult, {personId: person.personId}, {indexName: 'personId-index'});
      status['google'] = google.length > 0;

      const jucesp = await this.dataMapper.query(JucespResult, {personId: person.personId}, {indexName: 'personId-index'});
      status['jucesp'] = jucesp.length > 0;

      const sivec = await this.dataMapper.query(SivecResult, {personId: person.personId}, {indexName: 'personId-index'});
      status['sivec'] = sivec.length > 0;

      person['status'] = status;
      return person;
    }));
  }

}
