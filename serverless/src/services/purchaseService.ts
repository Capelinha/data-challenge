import { User } from "../models/user";
import { AmDynamodbDataMapper } from "../repositories/dynamoDataMapper";

/**
 * Class middleware that execute business rules for user service.
 */
export class UserService {
  private dataMapper: AmDynamodbDataMapper;
  constructor() {
    this.dataMapper = new AmDynamodbDataMapper();
  }

  /**
   * Create a new user
   * @param user object that represent the user
   */
  public async createUser(user: User) {
    return this.dataMapper.put(user);
  }

}
