import { SNSEvent, SNSHandler } from "aws-lambda";
import { By } from 'selenium-webdriver';
import { Driver } from "selenium-webdriver/chrome";
import { Key } from "selenium-webdriver/lib/input";
import { buildDriver } from "../../lib/chromium";
import { Person } from "../../models/person";

export const handler: SNSHandler = async (event: SNSEvent) => {

  for (const record of event.Records) {
    const person: Person = Object.assign(new Person, JSON.parse(record.Sns.Message));

    person
    
    const driver: Driver = buildDriver();

    try {
      await driver.get(`https://mbasic.facebook.com/`);

      await driver.findElement(By.css('#m_login_email')).click();
      await driver.findElement(By.css('#m_login_email')).sendKeys('email');

      await driver.findElement(By.css('input[type="password"]')).click();
      await driver.findElement(By.css('input[type="password"]')).sendKeys('senha');

      await driver.findElement(By.css('input[type="password"]')).sendKeys(Key.ENTER);

      // await driver.get(`https://mbasic.facebook.com/heycarol.v/about`);

      console.log(await driver.takeScreenshot());

      // await new CrawlerService().createResult(Object.assign(new SivecResult, response));
    } catch (e) {
      console.log(e);
    } finally {
      await driver.quit();
    }
  }
};
