import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { buildResponseError, success } from "../../lib/amAPIGatewayProxyResult";
import { PersonService } from "../../services/personService";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  event;
  try {
    const personId = event.pathParameters.personId;
    return success(await new PersonService().generateReport(personId));
  } catch (e) {
    console.log(e);
    return buildResponseError(e);
  }
};
