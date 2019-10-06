import { SQSHandler, SQSEvent } from "aws-lambda";
import { PersonService } from "../../services/personService";

export const handler: SQSHandler = async (event: SQSEvent) => {

  for (const record of event.Records) {
    const data = JSON.parse(record.body);
    await new PersonService().updateStatus(data.personId, data.portal, data.status);
  }
};

