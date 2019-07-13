import { ConsultaSocioResult } from "../models/consultaSocioResult";
import { EscavadorResult } from "../models/escavadorResult";
import { GoogleResult } from "../models/googleResult";
import { JucespResult } from "../models/jucespResult";
import { AmDynamodbDataMapper } from "../repositories/dynamoDataMapper";
import { SivecResult } from "../models/sivecResult";

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

  /**
   * Create a new Jucesp result
   * @param result object that represent the Jucesp result
   */
  public async createJucespResult(jucesp: JucespResult) {
    return this.dataMapper.put(jucesp);
  }

  /**
   * Create a new Sivec result
   * @param result object that represent the Sivec result
   */
  public async createSivecResult(sivec: SivecResult) {
    return this.dataMapper.put(sivec);
  }

}
