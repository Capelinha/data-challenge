import { CrawlerService } from './../../services/crawlerService';
import { SNSEvent, SNSHandler } from "aws-lambda";
import { By } from 'selenium-webdriver';
import { Driver } from "selenium-webdriver/chrome";
import { buildDriver } from "../../lib/chromium";
import { Person } from "../../models/person";
import { ArpenspResult } from "../../models/arpenspResult";

export const handler: SNSHandler = async (event: SNSEvent) => {

  for (const record of event.Records) {
    const person: Person = Object.assign(new Person, JSON.parse(record.Sns.Message));

    const driver: Driver = buildDriver();

    const crawlerService = new CrawlerService();

    person
    try {
      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/arpensp/pagina3-busca.html');
      await driver.findElement(By.css('input[value="N,TN"]')).click();
      
      await driver.findElement(By.css('input[name="numero_processo"]')).sendKeys('XXXXXXXXXXXXXXXX');
      await driver.executeScript('document.getElementById("vara_juiz_id").setAttribute("value", 297)');

      await driver.findElement(By.id('btn_pesquisar')).click();

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
      delete response['observaes'];

      response = {
        ASpouseName: response.nomeDoCnjugeA,
        bookNumber: response.nmeroDoLivro,
        bookType: response.tipoDoLivro,
        CNSNumber: response.nmeroDoCNS,
        collection: response.acrvo,
        entryDate: response.dataDeEntrada,
        matrcula: response.matrcula,
        newSpouseName: response.novoNomeDoCnjuge,
        page: response.nmeroDaFolha,
        personId: person.personId,
        registerNumber: response.nmeroDoRegistro,
        registrationDate: response.dataDoRegistro,
        registryOffice: response.cartrioDeRegistro,
        spouseName: response.nomeDoCnjuge,
        uF: response.uF,
        weddingDate: response.dataDoCasamento,
      }

      await crawlerService.updateStatus(person.personId, 'arpensp', 'finished');
      await crawlerService.createResult(Object.assign(new ArpenspResult, response));
    } catch (e) {
      await crawlerService.updateStatus(person.personId, 'arpensp', 'error');
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

