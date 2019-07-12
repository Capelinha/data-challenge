import { ConsultaSocioResult } from "../models/consultaSocioResult";
import { EscavadorResult } from "../models/escavadorResult";
import { GoogleResult } from "../models/googleResult";
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
   * @param result object that represent the escavador result
   */
  public async createEscavadorResult(escavador: EscavadorResult) {
    return this.dataMapper.put(escavador);
  }

  /**
   * Create a new consulta socio result
   * @param result object that represent the consultaSocio result
   */
  public async createConsultaSocioResult(consultaSocio: ConsultaSocioResult) {
    return this.dataMapper.put(consultaSocio);
  }

  /**
   * Create a new google result
   * @param result object that represent the google result
   */
  public async createGoogleResult(google: GoogleResult) {
    return this.dataMapper.put(google);
  }

}
