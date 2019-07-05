import { APIGatewayProxyHandler } from "aws-lambda";
import { validate, ValidationError } from "class-validator";
import { buildResponseError, ResponseError, success } from "../../lib/amAPIGatewayProxyResult";
import { User } from "../../models/user";
import { UserService } from "../../services/purchaseService";

export const handler: APIGatewayProxyHandler = async (event) => {

  try {
    const user: User = Object.assign(new User, JSON.parse(event.body));
    const errors: ValidationError[] = await validate(user);

    if (errors.length > 0) {
      throw new ResponseError(400, errors[0].toString());
    }

    return success(await new UserService().createUser(user));
  } catch (e) {
    return buildResponseError(e);
  }
};
