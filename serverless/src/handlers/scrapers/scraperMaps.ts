import { SNSEvent, SNSHandler } from "aws-lambda";
import { By } from 'selenium-webdriver';
import { Driver } from "selenium-webdriver/chrome";
import { buildDriver } from "../../lib/chromium";
import { Person } from "../../models/person";

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const handler: SNSHandler = async (event: SNSEvent) => {

  for (const record of event.Records) {
    const person: Person = Object.assign(new Person, JSON.parse(record.Sns.Message));

    const driver: Driver = buildDriver();

    try {
      await driver.get('https://www.google.com/maps/place/' + person.address.replace(' ', '+'));

      await sleep(5000);
      const fbutton = await driver.findElement(By.css('#pane > div > div.widget-pane-content.scrollable-y > div > div > div.section-hero-header-image > button'));
      await fbutton.click();
      await sleep(5000);
      const sbutton = await driver.findElement(By.css('#pane > div > div.widget-pane-toggle-button-container > button'));
      await sbutton.click();
      
      await sleep(5000);
      console.log(await driver.takeScreenshot());

    } catch (e) {
      console.log(e);
    } finally {
      await driver.quit();
    }
  }
};
