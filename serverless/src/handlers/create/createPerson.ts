import { APIGatewayProxyHandler } from "aws-lambda";
import { SNS } from "aws-sdk";
import { validate, ValidationError } from "class-validator";
import { buildResponseError, ResponseError, success } from "../../lib/amAPIGatewayProxyResult";
import { Person } from "../../models/person";
import { PersonService } from "../../services/personService";

export const handler: APIGatewayProxyHandler = async (event) => {

  try {
    const person: Person = Object.assign(new Person, JSON.parse(event.body));
    const errors: ValidationError[] = await validate(person);

    if (errors.length > 0) {
      throw new ResponseError(400, errors[0].toString());
    }

    await new SNS().publish({
      Message: JSON.stringify(person),
      TopicArn: `arn:aws:sns:us-east-1:${process.env.AWS_ACCOUNT}:search`
    }).promise();

    return success(await new PersonService().createPerson(person));
  } catch (e) {
    console.log(e);
    return buildResponseError(e);
  }
};
