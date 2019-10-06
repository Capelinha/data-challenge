import { SNSEvent, SNSHandler } from "aws-lambda";
import { By } from "selenium-webdriver";
import { Driver } from "selenium-webdriver/chrome";
import { buildDriver } from "../../lib/chromium";
import { Person } from "../../models/person";
import { CrawlerService } from "../../services/crawlerService";
import { ConsultaSocioResult } from './../../models/consultaSocioResult';

export const handler: SNSHandler = async (event: SNSEvent) => {

  for (const record of event.Records) {
    const personSearch: Person = Object.assign(new Person, JSON.parse(record.Sns.Message));

    if (personSearch.searchPages.indexOf('C4') === -1) {
      break;
    }

    const crawlerService = new CrawlerService();

    const driver: Driver = buildDriver();
    const name = `${personSearch.firstName} ${personSearch.lastName}`.replace(' ', ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    try {
      await driver.get('https://www.consultasocio.com/buscar/?keyword=' + name.replace(' ', '+'));

      const people = await driver.findElements(By.css('.result a'));
      let find = [];

      for (const person of people) {
        if (await person.getAttribute('title') === name) {
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
          informations: [],
          companies: [],
          personId: personSearch.personId
        }

        for (const ele of await driver.findElements(By.css('#details > div > div:nth-child(2) > div:nth-child(5) > p'))) {
          response.informations.push(await ele.getText());
        }

        for (const ele of await driver.findElements(By.css('.cnpj'))) {
          const company = {};
          for (const subEle of await ele.findElements(By.css('p'))) {
            const text = await subEle.getText();
            const pre = text.split(':')[0];
            const trash = ': ';
            switch (pre) {
              case 'CNPJ':
                company['cnpj'] = text.replace(pre + trash, '');
                break;
              case 'Razão social':
                company['companyName'] = text.replace(pre + trash, '');
                break;
              case 'Endereço':
                company['address'] = text.replace(pre + trash, '');
                break;
              case 'Atividade econômica':
                company['activity'] = text.replace(pre + trash, '');
                break;
              case 'Natureza jurídica':
                company['nature'] = text.replace(pre + trash, '');
                break;
              case 'Data de abertura':
                company['openDate'] = text.replace(pre + trash, '');
                break;
              case 'Capital social':
                company['openDate'] = text.replace(pre + trash, '');
                break;
              case 'Telefone de contato':
                company['telphone'] = text.replace(pre + trash, '');
                break;
              case 'E-mail':
                company['email'] = text.replace(pre + trash, '');
                break;
              case 'Nome fantasia':
                company['fantasyName'] = text.replace(pre + trash, '');
                break;

            }
          }
          response.companies.push(company);
        };
        await crawlerService.updateStatus(person.personId, 'consultaSocio', 'finished');
        await crawlerService.createResult(Object.assign(new ConsultaSocioResult, response));
        break;
      }

    } catch (e) {
      await crawlerService.updateStatus(personSearch.personId, 'consultaSocio', 'error');
      console.log(e);
    } finally {
      await driver.quit();
    }
  }
};
