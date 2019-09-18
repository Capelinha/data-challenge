import { CrawlerService } from './../../services/crawlerService';
import { SNSEvent, SNSHandler } from "aws-lambda";
import { By } from 'selenium-webdriver';
import { Driver } from "selenium-webdriver/chrome";
import { buildDriver } from "../../lib/chromium";
import { Person } from "../../models/person";
import { InfosegResult } from '../../models/infosegResult';

export const handler: SNSHandler = async (event: SNSEvent) => {

  for (const record of event.Records) {
    const person: Person = Object.assign(new Person, JSON.parse(record.Sns.Message));

    const driver: Driver = buildDriver();

    const crawlerService = new CrawlerService();

    try {
      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/infoseg/login.html');
      await driver.findElement(By.id('formLogin:identificacao')).click();
      await driver.findElement(By.id('formLogin:identificacao')).sendKeys('USUARIO');

      await driver.findElement(By.id('formLogin:senha')).click();
      await driver.findElement(By.id('formLogin:senha')).sendKeys('SENHA');

      await driver.findElement(By.id('formLogin:btnEntrar')).click();

      await driver.findElement(By.css('#q')).sendKeys(person.cpf);
      await driver.findElement(By.css('#salvar')).click();

      const rows = await driver.findElements(By.css('#p0-content>:not(.sinesp-counter-bar)'));

      let response = {
        personId: person.personId,
        cpf: person.cpf
      };

      for (const row of rows) {
        const title = await row.findElement(By.css('h4 a')).getText();
        const type = {};

        const attr = await row.findElements(By.css('.row label'));
        const data = await row.findElements(By.css('.row p'));

        for (let i = 0; i<attr.length; i++) {
          if (attr[i] !== undefined && data[i] !== undefined) {
            type[camelize(await attr[i].getText())] = await data[i].getText();
          }
        }
        delete type[''];

        response[camelize(title)] = type;
      }

      await crawlerService.updateStatus(person.personId, 'infoseg', 'finished');
      await crawlerService.createResult(Object.assign(new InfosegResult, response));

    } catch (e) {
      await crawlerService.updateStatus(person.personId, 'infoseg', 'error');
      console.log(e);
    } finally {
      await driver.quit();
    }
  }
};

function camelize(str: string) {
  let text = str.replace(':', '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z ]/g, "");
  text = text.toLowerCase();
  return text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

