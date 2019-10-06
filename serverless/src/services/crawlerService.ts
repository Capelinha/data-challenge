import { AmDynamodbDataMapper } from "../repositories/dynamoDataMapper";
import { SQS } from "aws-sdk";

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
    await new SQS().sendMessage({
      MessageBody: JSON.stringify({personId, portal, status}),
      QueueUrl: `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT}/status-update`
    }).promise();
  }

}
