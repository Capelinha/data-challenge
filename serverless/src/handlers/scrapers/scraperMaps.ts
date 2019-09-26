import { CrawlerService } from './../../services/crawlerService';
import { SNSEvent, SNSHandler } from "aws-lambda";
import { By } from 'selenium-webdriver';
import { Driver } from "selenium-webdriver/chrome";
import { buildDriver } from "../../lib/chromium";
import { S3 } from "aws-sdk";
import * as uuid from 'uuid';
import { MapsResult } from '../../models/mapsResult';
import { Person } from '../../models/person';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const handler: SNSHandler = async (event: SNSEvent) => {

  for (const record of event.Records) {
    const address: string = JSON.parse(record.Sns.Message).address;
    const person: Person = Object.assign(new Person, JSON.parse(record.Sns.Message).person);
    const driver: Driver = buildDriver();

    try {
      await driver.get('https://www.google.com/maps/place/' + address);

      await sleep(5000);
      const fbutton = await driver.findElement(By.css('#pane > div > div.widget-pane-content.scrollable-y > div > div > div.section-hero-header-image > button'));
      await fbutton.click();
      await sleep(5000);
      const sbutton = await driver.findElement(By.css('#pane > div > div.widget-pane-toggle-button-container > button'));
      await sbutton.click();
      
      await sleep(5000);

      const Key = `${uuid.v4()}.png`;
      const Bucket = 'am-images-bucket-dev';

      const Body = Buffer.from(await driver.takeScreenshot(), 'base64');

      (new S3()).putObject({
        ACL: 'public-read',
        Body,
        Key,
        Bucket,
        ContentType: 'image/png'
      }, (err, data) => {
        if (err) {
          console.error(err);
        } else {
          console.log(data);
        }
      });

      await new CrawlerService().createResult(Object.assign(new MapsResult, {filename: Key, personId: person.personId, address}));

    } catch (e) {
      console.log(e);
    } finally {
      await driver.quit();
    }
  }
};
