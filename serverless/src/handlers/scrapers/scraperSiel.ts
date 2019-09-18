import { SNSEvent, SNSHandler } from "aws-lambda";
import { By } from 'selenium-webdriver';
import { Driver } from "selenium-webdriver/chrome";
import { buildDriver } from "../../lib/chromium";
import { Person } from "../../models/person";
import { SielResult } from '../../models/sielResult';
import { CrawlerService } from '../../services/crawlerService';

export const handler: SNSHandler = async (event: SNSEvent) => {

  for (const record of event.Records) {
    const person: Person = Object.assign(new Person, JSON.parse(record.Sns.Message));

    const driver: Driver = buildDriver();

    const crawlerService = new CrawlerService();

    person
    try {
      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/siel/login.html');
      await driver.findElement(By.css('input[name=usuario]')).click();
      await driver.findElement(By.css('input[name=usuario]')).sendKeys('USUARIO');
      await driver.findElement(By.css('input[name=senha]')).click();
      await driver.findElement(By.css('input[name=senha]')).sendKeys('SENHA');
      await driver.findElement(By.css('input[type=submit]')).click();
      
      await driver.findElement(By.css('input[name="nome"]')).sendKeys(person.firstName + ' ' + person.lastName);
      await driver.findElement(By.id('num_processo')).sendKeys('99999999999999999999');
      await driver.findElement(By.css('input[type=image')).click();

      const rows = await driver.findElements(By.css(' td:not(:only-child)'));

      let invert = true;
      let attr = '';
      let response: any = {};
      for (const td of rows) {
        if (invert) {
          attr = camelize((await td.getText()).replace(':', '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z ]/g, ""));
          invert = false;
        } else {
          if (!response[attr]) {
            response[attr] = await td.getText();
          }

          invert = true;
        }
      }

      delete response[''];

      response = {
        name: response.nome,
        title: response.titulo,
        birthDate: response.dataNasc,
        zone: response.zona,
        address: response.endereco,
        county: response.municipio,
        uF: response.uF,
        homeDate: response.dataDomicilio,
        fatherName: response.nomePai,
        motherName: response.nomeMae,
        personId: person.personId,
        naturalness: response.naturalidade,
        validationCode: response.codValidacao,
      }

      await crawlerService.updateStatus(person.personId, 'siel', 'finished');
      await crawlerService.createResult(Object.assign(new SielResult, response));
    } catch (e) {
      await crawlerService.updateStatus(person.personId, 'siel', 'error');
      console.log(e);
    } finally {
      await driver.quit();
    }
  }
};

function camelize(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

