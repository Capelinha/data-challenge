import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import { SNS } from "aws-sdk";
import { validate, ValidationError } from "class-validator";
import { buildResponseError, ResponseError, created } from "../../lib/amAPIGatewayProxyResult";
import { Person } from "../../models/person";
import { PersonService } from "../../services/personService";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {

  try {
    const person: Person = Object.assign(new Person, JSON.parse(event.body));
    const errors: ValidationError[] = await validate(person);

    if (errors.length > 0) {
      throw new ResponseError(400, errors[0].toString());
    }

    const personSaved = await new PersonService().createPerson(person);
    await new SNS().publish({
      Message: JSON.stringify(personSaved),
      TopicArn: `arn:aws:sns:us-east-1:${process.env.AWS_ACCOUNT}:search`
    }).promise();

    return created(personSaved);
  } catch (e) {
    console.log(e);
    return buildResponseError(e);
  }
};
