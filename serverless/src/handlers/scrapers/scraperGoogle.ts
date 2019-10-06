import { SNSEvent, SNSHandler } from "aws-lambda";
import { By } from 'selenium-webdriver';
import { Driver } from "selenium-webdriver/chrome";
import { buildDriver } from "../../lib/chromium";
import { Person } from "../../models/person";
import { GoogleResult } from './../../models/googleResult';
import { CrawlerService } from './../../services/crawlerService';

export const handler: SNSHandler = async (event: SNSEvent) => {

  for (const record of event.Records) {
    const person: Person = Object.assign(new Person, JSON.parse(record.Sns.Message));

    if (person.searchPages.indexOf('G1') === -1) {
      break;
    }

    const driver: Driver = buildDriver();

    const crawlerService = new CrawlerService();

    try {
      const name = `${person.firstName} ${person.lastName}`.replace(' ', ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      await driver.get('https://www.google.com/search?q="' + name + '"');

      const results = await driver.findElements(By.css('.rc'));

      const response = [];

      for (const result of results) {
        const title = await result.findElement(By.css('h3')).getText();
        const description = await result.findElement(By.css('.st')).getText();
        const href = await result.findElement(By.css('a')).getAttribute('href');
        response.push({
          title,
          description,
          href
        });
      }

      await crawlerService.updateStatus(person.personId, 'google', 'finished');
      await crawlerService.createResult(Object.assign(new GoogleResult, { results: response, personId: person.personId }));

    } catch (e) {
      await crawlerService.updateStatus(person.personId, 'google', 'error');
      console.log(e);
    } finally {
      await driver.quit();
    }
  }
};
