import { Person } from "../models/person";
import { AmDynamodbDataMapper } from "../repositories/dynamoDataMapper";

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

  public async getPeople() {
    return this.dataMapper.scan(Person);
  }

}
