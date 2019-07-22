import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { buildResponseError, success } from "../../lib/amAPIGatewayProxyResult";
import { PersonService } from "../../services/personService";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  event;
  try {
    return success(await new PersonService().getPeople());
  } catch (e) {
    console.log(e);
    return buildResponseError(e);
  }
};
