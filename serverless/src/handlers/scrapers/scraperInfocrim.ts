import { SNSEvent, SNSHandler } from "aws-lambda";
import { By } from 'selenium-webdriver';
import { Driver } from "selenium-webdriver/chrome";
import { buildDriver } from "../../lib/chromium";
import { Person } from "../../models/person";
import { CrawlerService } from "../../services/crawlerService";
import { InfocrimResult } from "../../models/infocrimResult";

export const handler: SNSHandler = async (event: SNSEvent) => {

  for (const record of event.Records) {
    const person: Person = Object.assign(new Person, JSON.parse(record.Sns.Message));

    const driver: Driver = buildDriver();

    const crawlerService = new CrawlerService();

    try {
      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/infocrim/login.html');
      await driver.findElement(By.css('input[name=cd_usuario]')).click();
      await driver.findElement(By.css('input[name=cd_usuario]')).sendKeys('USUARIO');
      await driver.findElement(By.css('input[name=cd_senha]')).click();
      await driver.findElement(By.css('input[name=cd_senha]')).sendKeys('SENHA');
      await driver.findElement(By.css('td>a>img[alt="Envia dados"]')).click();
      await driver.findElement(By.css('#enviar')).click();

      let rows = await driver.findElements(By.css('tr[bgColor]'));
      const results = [];

      for (let i = 0; i < 1; i++) {
        const row = rows[i];
        const report = {};

        report['elab'] = await row.findElement(By.css('td:nth-child(2)')).getText();
        report['occurrence'] = await row.findElement(By.css('td:nth-child(3)')).getText();
        report['type'] = await row.findElement(By.css('td:nth-child(4)')).getText();
        report['nature'] = await row.findElement(By.css('td:nth-child(6)')).getText();

        await row.findElement(By.css('a')).click();

        let ele = await driver.findElement(By.xpath('/html/body/pre/b[text()="AUTOR"]/..'));
        report['author'] = await ele.findElement(By.css('a')).getText();

        ele = await driver.findElement(By.xpath('/html/body/pre/b[text()="VITIMA"]/..'));
        report['victim'] = await ele.findElement(By.css('a')).getText();

        ele = await driver.findElement(By.xpath('/html/body/pre/b[text()="REPRESENTANTE"]/..'));
        report['representative'] = await ele.findElement(By.css('a')).getText();

        report['resume'] = (await driver.findElement(By.xpath('/html/body')).getText()).split('Histórico :')[1];

        await driver.navigate().back();
        rows = await driver.findElements(By.css('tr[bgColor]'));

        results.push(report);
      }

      await crawlerService.updateStatus(person.personId, 'infocrim', 'finished');
      await crawlerService.createResult(Object.assign(new InfocrimResult, {results, personId: person.personId}))
    } catch (e) {
      await crawlerService.updateStatus(person.personId, 'infocrim', 'error');
      console.log(e);
    } finally {
      await driver.quit();
    }
  }
};
