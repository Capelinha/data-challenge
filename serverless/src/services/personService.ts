import { ArpenspResult } from './../models/arpenspResult';
import { ArispResult } from './../models/arispResult';
import { GoogleResult } from './../models/googleResult';
import { EscavadorResult } from './../models/escavadorResult';
import { ConsultaSocioResult } from './../models/consultaSocioResult';
import { Person } from "../models/person";
import { AmDynamodbDataMapper } from "../repositories/dynamoDataMapper";
import { JucespResult } from '../models/jucespResult';
import { SivecResult } from '../models/sivecResult';
import { MapsResult } from '../models/mapsResult';
import { CadespResult } from '../models/cadespResult';
import { CensecResult } from '../models/censecResult';
import { InfocrimResult } from '../models/infocrimResult';
import { SielResult } from '../models/sielResult';

/**
 * Class middleware that execute business rules for person service.
 */
export class PersonService {
  private dataMapper: AmDynamodbDataMapper;
  constructor() {
    this.dataMapper = new AmDynamodbDataMapper();
  }

  public async createPerson(person: Person) {
    person.status = {
      arisp: 'starting',
      arpensp: 'starting',
      cadesp: 'starting',
      caged: 'starting',
      censec: 'starting',
      consultaSocio: 'starting',
      escavador: 'starting',
      google: 'starting',
      infocrim: 'starting',
      infoseg: 'starting',
      jucesp: 'starting',
      siel: 'starting',
      sivec: 'starting',
    };
    return this.dataMapper.put(person);
  }

  public async getPersonById(personId: string) {
    const person = await this.dataMapper.get(Object.assign(new Person, { personId }));
    
    const results = {};

    results['consultaSocio'] = await this.dataMapper.query(ConsultaSocioResult, {personId: person.personId}, {indexName: 'personId-index'});
    results['escavador'] = await this.dataMapper.query(EscavadorResult, {personId: person.personId}, {indexName: 'personId-index'});
    results['google'] = await this.dataMapper.query(GoogleResult, {personId: person.personId}, {indexName: 'personId-index'});
    results['jucesp'] = await this.dataMapper.query(JucespResult, {personId: person.personId}, {indexName: 'personId-index'});
    results['sivec'] = await this.dataMapper.query(SivecResult, {personId: person.personId}, {indexName: 'personId-index'});
    results['maps'] = await this.dataMapper.query(MapsResult, {personId: person.personId}, {indexName: 'personId-index'});
    results['arisp'] = await this.dataMapper.query(ArispResult, {personId: person.personId}, {indexName: 'personId-index'});
    results['arpensp'] = await this.dataMapper.query(ArpenspResult, {personId: person.personId}, {indexName: 'personId-index'});
    results['cadesp'] = await this.dataMapper.query(CadespResult, {personId: person.personId}, {indexName: 'personId-index'});
    results['censec'] = await this.dataMapper.query(CensecResult, {personId: person.personId}, {indexName: 'personId-index'});
    results['infocrim'] = await this.dataMapper.query(InfocrimResult, {personId: person.personId}, {indexName: 'personId-index'});
    results['infoseg'] = await this.dataMapper.query(InfocrimResult, {personId: person.personId}, {indexName: 'personId-index'});
    results['jucesp'] = await this.dataMapper.query(JucespResult, {personId: person.personId}, {indexName: 'personId-index'});
    results['siel'] = await this.dataMapper.query(SielResult, {personId: person.personId}, {indexName: 'personId-index'});
    results['sivec'] = await this.dataMapper.query(SivecResult, {personId: person.personId}, {indexName: 'personId-index'});

    person['result'] = results;
    return person;
  }

  public async getPeople() {
    return this.dataMapper.scan(Person);
  }

}
