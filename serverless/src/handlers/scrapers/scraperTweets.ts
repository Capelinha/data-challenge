import { SNSHandler, SNSEvent } from "aws-lambda";
import { Driver } from "selenium-webdriver/chrome";
import { buildDriver } from "../../lib/chromium";
import { ByTypeEnum, iterateElementData } from "../../lib/iteratePage";
import { Person } from "../../models/person";

export const handler: SNSHandler = async (event: SNSEvent) => {

  for (const record of event.Records) {
    const person: Person = Object.assign(new Person, JSON.parse(record.Sns.Message));
    console.log(JSON.stringify(person));

    const driver: Driver = buildDriver();

    try {
      await driver.get('https://twitter.com/jairbolsonaro');

      const data = await iterateElementData(driver,
        [
          {
            name: 'tweets',
            selector: 'tweet',
            type: ByTypeEnum.CLASS_NAME,
            children: [
              {
                name: 'text',
                selector: 'TweetTextSize',
                type: ByTypeEnum.CLASS_NAME,
              }
            ]
          }
        ], true);

      console.log(JSON.stringify(data));

    } catch (e) {
      console.log(e);
    } finally {
      await driver.quit();
    }
  }
};
