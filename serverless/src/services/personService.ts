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

  /**
   * Create a new person
   * @param person object that represent the person
   */
  public async createPerson(person: Person) {
    return this.dataMapper.put(person);
  }

}
