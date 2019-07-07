import { EscavadorResult } from "../models/escavadorResult";
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
   * Create a new escavador result
   * @param person object that represent the escavador result
   */
  public async createEscavadorResult(escavador: EscavadorResult) {
    return this.dataMapper.put(escavador);
  }

}
