import { SNSEvent, SNSHandler } from "aws-lambda";
import { By } from 'selenium-webdriver';
import { Driver } from "selenium-webdriver/chrome";
import { buildDriver } from "../../lib/chromium";
import { Person } from "../../models/person";
import { SivecResult } from "../../models/sivecResult";
import { CrawlerService } from './../../services/crawlerService';

export const handler: SNSHandler = async (event: SNSEvent) => {

  for (const record of event.Records) {
    const person: Person = Object.assign(new Person, JSON.parse(record.Sns.Message));

    if (person.searchPages.indexOf('S2') === -1) {
      break;
    }

    const driver: Driver = buildDriver();

    const crawlerService = new CrawlerService();

    try {
      await driver.get(`http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/sivec/login.html`);

      await driver.findElement(By.css('input[name="nomeusuario"]')).click();
      await driver.findElement(By.css('input[name="nomeusuario"]')).sendKeys('email');


      await driver.findElement(By.css('input[name="senhausuario"]')).click();
      await driver.findElement(By.css('input[name="senhausuario"]')).sendKeys('senha');

      await driver.findElement(By.css('.btn[type="submit"]')).click();

      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/sivec/pagina3-pesquisa-rg.html');

      await driver.findElement(By.css('#idValorPesq')).click();
      await driver.findElement(By.css('#idValorPesq')).sendKeys(person.rg);

      await driver.findElement(By.css('#procurar')).click();

      await driver.findElement(By.css('.textotab1 a')).click();

      const data = await driver.findElements(By.css('.container.top-buffer15 .textotab2, .textotab'));
      let invert = true;
      let attr = '';
      let response: any = {};
      for (const td of data) {
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
        gender: response.sexo,
        birthday: response.dataNascimento,
        rg: response.rG,
        vecControlNumber: response.nControleVEC,
        rgType: response.tipoDeRG,
        rgIssueDate: response.dataEmissaoRG,
        nickname: response.alcunha,
        maritalStatus: response.estadoCivil,
        naturalness: response.naturalidade,
        naturalnessSn: response.naturalizadosn,
        identificationStation: response.postoDeIdentificacao,
        literacy: response.grauDeInstrucao,
        fundamentalFormula: response.formulaFundamental,
        fathersName: response.nomeDoPai,
        eyesColor: response.corDosOlhos,
        mothersName: response.nomeDaMae,
        hair: response.cabelo,
        skinColor: response.corDaPele,
        address: response.residencial,
        workplace: response.trabalho,
        occupation: response.profissao,
        personId: person.personId
      }

      await crawlerService.updateStatus(person.personId, 'sivec', 'finished');
      await crawlerService.createResult(Object.assign(new SivecResult, response));
    } catch (e) {
      await crawlerService.updateStatus(person.personId, 'sivec', 'error');
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
