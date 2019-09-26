import { SNSEvent, SNSHandler } from "aws-lambda";
import { By } from 'selenium-webdriver';
import { Driver } from "selenium-webdriver/chrome";
import { buildDriver } from "../../lib/chromium";
import { Person } from "../../models/person";
import { CensecResult } from './../../models/censecResult';
import { CrawlerService } from './../../services/crawlerService';

export const handler: SNSHandler = async (event: SNSEvent) => {

  for (const record of event.Records) {
    const person: Person = Object.assign(new Person, JSON.parse(record.Sns.Message));

    const driver: Driver = buildDriver();

    const crawlerService = new CrawlerService();

    person
    try {
      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/censec/login.html');
      await driver.findElement(By.css('input[name=LoginTextBox]')).click();
      await driver.findElement(By.css('input[name=LoginTextBox]')).sendKeys('USUARIO');
      await driver.findElement(By.css('input[name=SenhaTextBox]')).click();
      await driver.findElement(By.css('input[name=SenhaTextBox]')).sendKeys('SENHA');
      await driver.findElement(By.css('input[type=submit]')).click();

      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/censec/pagina3-pesquisa.html');

      await driver.findElement(By.id('ctl00_ContentPlaceHolder1_DocumentoTextBox')).sendKeys(person.cnpj);
      await driver.findElement(By.id('ctl00_ContentPlaceHolder1_BuscarButton')).click();

      let response = {
        personId: person.personId,
        results: [],
      }

      let rows = await driver.findElements(By.css('.linha1Tabela'));

      for (let i = 0; i < rows.length; i++) {
        rows = await driver.findElements(By.css('.linha1Tabela'));
        const row = rows[i];
        
        const cols = await row.findElements(By.css('td'));

        const data = {
          name: await cols[1].getText(),
          document: await cols[2].getText(),
          identity: await cols[3].getText(),
          registry: await cols[4].getText(),
          type: await cols[5].getText(),
          book: await cols[6].getText(),
          page: await cols[7].getText(),
          date: await cols[8].getText(),
          members: [],
        };

        await cols[0].findElement(By.css('input')).click();
        await driver.findElement(By.id('ctl00_ContentPlaceHolder1_VisualizarButton')).click();

        const rowDetails = await driver.findElements(By.css('.linha1Tabela'));
        for (const rowDetail of rowDetails) {
          const colsDetail = await rowDetail.findElements(By.css('td'));
          data.members.push({
            name: await colsDetail[1].getText(),
            document: await colsDetail[2].getText(),
            quality: await colsDetail[3].getText(),
          });
        }

        response.results.push(data);

        await driver.navigate().back();
      }

      await crawlerService.updateStatus(person.personId, 'censec', 'finished');
      await crawlerService.createResult(Object.assign(new CensecResult, response));
    } catch (e) {
      await crawlerService.updateStatus(person.personId, 'censec', 'error');
      console.log(e);
    } finally {
      await driver.quit();
    }
  }
};
