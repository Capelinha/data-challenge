import { S3 } from 'aws-sdk';
import axios from 'axios';
import * as uuid from 'uuid';
import { CadespResult } from '../models/cadespResult';
import { CensecResult } from '../models/censecResult';
import { InfocrimResult } from '../models/infocrimResult';
import { JucespResult } from '../models/jucespResult';
import { MapsResult } from '../models/mapsResult';
import { Person } from "../models/person";
import { SielResult } from '../models/sielResult';
import { SivecResult } from '../models/sivecResult';
import { AmDynamodbDataMapper } from "../repositories/dynamoDataMapper";
import { ArispResult } from './../models/arispResult';
import { ArpenspResult } from './../models/arpenspResult';
import { ConsultaSocioResult } from './../models/consultaSocioResult';
import { EscavadorResult } from './../models/escavadorResult';
import { GoogleResult } from './../models/googleResult';

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
    return this.dataMapper.get(Object.assign(new Person, { personId }));
  }

  public async generateReport(personId: string) {
    let person = await this.getPersonById(personId);

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

    try {
      const api = axios.create({
        headers: {
          'X-Auth-Key': '4e019cab2abeb29613f7626c507c4a5291618e2c286faefe775ac8ba745d10ee',
          'X-Auth-Secret': '7f2e20db22889ab6077295754ebc635b4e18b377a77164f6c25b6ea8090a323e',
          'X-Auth-Workspace': 'm.oliveiraigreja@gmail.com'
        },
        baseURL: 'https://us1.pdfgeneratorapi.com/api/v3'
      });
  
      const data = (await api.post('templates/58480/output', person)).data.response;
  
      const Key = `${uuid.v4()}.pdf`;
      const Bucket = 'am-files-bucket-dev';
      const Body = Buffer.from(data, 'base64');
  
      await (new S3()).upload({
        ACL: 'public-read',
        Body,
        Key,
        Bucket,
        ContentType: 'application/pdf'
      }).promise();
      person.reportUrl = 'https://am-files-bucket-dev.s3.amazonaws.com/' + Key;

      person = await this.dataMapper.update(person);
    } catch (e) {
      console.error(e);
    }
    return person;
  }

  public async getPeople() {
    return this.dataMapper.scan(Person);
  }

}
