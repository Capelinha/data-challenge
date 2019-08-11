import { AmDynamodbDataMapper } from "../repositories/dynamoDataMapper";

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

}
