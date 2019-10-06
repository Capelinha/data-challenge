import { SNSEvent, SNSHandler } from "aws-lambda";
import { By } from "selenium-webdriver";
import { Driver } from "selenium-webdriver/chrome";
import { buildDriver } from "../../lib/chromium";
import { EscavadorResult } from "../../models/escavadorResult";
import { Person } from "../../models/person";
import { CrawlerService } from "../../services/crawlerService";

export const handler: SNSHandler = async (event: SNSEvent) => {

  for (const record of event.Records) {
    const person: Person = Object.assign(new Person, JSON.parse(record.Sns.Message));

    if (person.searchPages.indexOf('E1') === -1) {
      break;
    }

    const crawlerService = new CrawlerService();

    const driver: Driver = buildDriver();
    const name = `${person.firstName} ${person.lastName}`.replace(' ', ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    try {
      await driver.get('https://www.escavador.com/busca?qo=en&q=' + name.replace(' ', '+'));
      
      const people = await driver.findElements(By.css('.body>ul>li>a'));
      let find = [];

      for (const person of people) {
        if ((await person.getText()).normalize('NFD').replace(/[\u0300-\u036f]/g, '') === name) {
          find.push(person);
        }
      }

      if (find.length === 0) {
        throw new Error('Results not found');
      }

      // Enter people's page and extract data

      for (const person of find) {
        await driver.get(await person.getAttribute('href'));

        let response = {
          states: [],
          description: '',
          lawsuit: [],
          personId: person.personId
        }

        for (const ele of await driver.findElements(By.className('state'))){
          const state = {};
          state['title'] = await ele.findElement(By.className('title')).getText();
          state['heading'] = await ele.findElement(By.className('heading')).getText();
          response.states.push(state);
        }

        response.description = await driver.findElement(By.css('.box.-flushHorizontal>p')).getText();
        
        for(const ele of await driver.findElements(By.className('bodyLine'))){
          const lawsuit = {};
          lawsuit['type'] = await ele.findElement(By.className('type')).getText();
          lawsuit['number'] = await ele.findElement(By.className('number')).getText();
          lawsuit['date'] = await ele.findElement(By.className('date')).getText();
          lawsuit['related'] = [];

          for(const personName of await ele.findElements(By.className('item'))){
            lawsuit['related'].push(await personName.findElement(By.css('a')).getText());
          }

          response.lawsuit.push(lawsuit);
        }

        await crawlerService.updateStatus(person.personId, 'escavador', 'finished');
        await crawlerService.createResult(Object.assign(new EscavadorResult, response));
        break;
      }

    } catch (e) {
      await crawlerService.updateStatus(person.personId, 'escavador', 'error');
      console.log(e);
    } finally {
      await driver.quit();
    }
  }
};
