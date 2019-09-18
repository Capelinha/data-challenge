import { AmDynamodbDataMapper } from "../repositories/dynamoDataMapper";
import { Person } from '../models/person';

/**
 * Class middleware that execute business rules for crawler service.
 */
export class CrawlerService {
  private dataMapper: AmDynamodbDataMapper;
  constructor() {
    this.dataMapper = new AmDynamodbDataMapper();
  }

   /**
   * Create a new result
   * @param result object that represent the result
   */
  public async createResult<T>(result: T) {
    return this.dataMapper.put(result);
  }

  /**
   * Create a new result
   * @param result object that represent the result
   */
  public async updateStatus(personId: string, portal: string, status: string) {
    const person = await this.dataMapper.get(Object.assign(new Person, { personId }));
    person.status[portal] = status;
    return this.dataMapper.update(person);
  }

}
