import { SNSEvent, SNSHandler } from "aws-lambda";
import { By } from 'selenium-webdriver';
import { Driver } from "selenium-webdriver/chrome";
import { buildDriver } from "../../lib/chromium";
import { Person } from "../../models/person";
import { CrawlerService } from "../../services/crawlerService";
import { DetranResult } from './../../models/detranResult';

export const handler: SNSHandler = async (event: SNSEvent) => {

  for (const record of event.Records) {
    const person: Person = Object.assign(new Person, JSON.parse(record.Sns.Message));

    if (person.searchPages.indexOf('D1') === -1) {
      break;
    }

    const driver: Driver = buildDriver();

    const crawlerService = new CrawlerService();

    try {
      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/detran/login.html');
      
      await driver.findElement(By.id('form:j_id563205015_44efc1ab')).click();
      await driver.findElement(By.id('form:j_id563205015_44efc1ab')).sendKeys('USUARIO');

      await driver.findElement(By.id('form:j_id563205015_44efc191')).click();
      await driver.findElement(By.id('form:j_id563205015_44efc191')).sendKeys('SENHA');

      await driver.findElement(By.id('form:j_id563205015_44efc15b')).click();

      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/detran/pagina4-pesquisa-imagem-cnh.html');

      await driver.findElement(By.xpath('//*[@id="form:cpf"]')).click();
      await driver.findElement(By.xpath('//*[@id="form:cpf"]')).sendKeys(person.cpf);
      await driver.findElement(By.xpath('//*[@id="form:pnQuery_content"]/table[3]/tbody/tr/td/a')).click();
      await driver.switchTo().window((await driver.getAllWindowHandles())[1]);

      const cnh = {
        renach: await driver.findElement(By.xpath('//*[@id="form:pnCNH"]/tbody/tr[2]/td/table/tbody/tr/td[2]/table/tbody/tr[1]/td/table/tbody/tr/td[1]/span')).getText(),
        category: await driver.findElement(By.xpath('//*[@id="form:pnCNH"]/tbody/tr[2]/td/table/tbody/tr/td[2]/table/tbody/tr[1]/td/table/tbody/tr/td[2]/span')).getText(),
        date: await driver.findElement(By.xpath('//*[@id="form:pnCNH"]/tbody/tr[2]/td/table/tbody/tr/td[2]/table/tbody/tr[1]/td/table/tbody/tr/td[3]/span')).getText(),
        name: await driver.findElement(By.xpath('//*[@id="form:pnCNH"]/tbody/tr[2]/td/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr[2]/td/span')).getText(),
        fatherName: await driver.findElement(By.xpath('//*[@id="form:pnCNH"]/tbody/tr[2]/td/table/tbody/tr/td[2]/table/tbody/tr[3]/td/table/tbody/tr[2]/td/span')).getText(),
        motherName: await driver.findElement(By.xpath('//*[@id="form:pnCNH"]/tbody/tr[2]/td/table/tbody/tr/td[2]/table/tbody/tr[4]/td/table/tbody/tr[2]/td/span')).getText(),
        registry: await driver.findElement(By.xpath('//*[@id="form:pnCNH"]/tbody/tr[2]/td/table/tbody/tr/td[2]/table/tbody/tr[5]/td/table/tbody/tr/td[1]/span')).getText(),
        indentity: await driver.findElement(By.xpath('//*[@id="form:pnCNH"]/tbody/tr[2]/td/table/tbody/tr/td[2]/table/tbody/tr[5]/td/table/tbody/tr/td[2]/span')).getText(),
        typographic: await driver.findElement(By.xpath('//*[@id="form:pnCNH"]/tbody/tr[2]/td/table/tbody/tr/td[2]/table/tbody/tr[5]/td/table/tbody/tr/td[3]/span')).getText(),
        personId: person.personId
      }
      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/detran/pagina3-pesquisa-linha-de-vida.html');

      await driver.findElement(By.id('form:rg')).click();
      await driver.findElement(By.id('form:rg')).sendKeys(person.rg);
      await driver.findElement(By.id('form:nome')).click();
      await driver.findElement(By.id('form:nome')).sendKeys(person.firstName + ' ' + person.lastName);
      await driver.findElement(By.xpath('//*[@id="form:j_id2049423534_c43228e_content"]/table[3]/tbody/tr/td/a')).click();
      await driver.switchTo().window((await driver.getAllWindowHandles())[2]);
      cnh['timelinePdf'] = await driver.getCurrentUrl();

      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/detran/pagina5-pesquisa-veiculo.html');
      await driver.findElement(By.id('form:j_id2124610415_1b3be1e3')).click();
      await driver.findElement(By.id('form:j_id2124610415_1b3be1e3')).sendKeys(person.cpf);

      await driver.findElement(By.xpath('//*[@id="form:j_id2124610415_1b3be155_content"]/table[3]/tbody/tr/td/a')).click();
      await driver.switchTo().window((await driver.getAllWindowHandles())[3]);
      cnh['veiclePdf'] = await driver.getCurrentUrl();

      console.log(JSON.stringify(cnh));
      await crawlerService.updateStatus(person.personId, 'detran', 'finished');
      await crawlerService.createResult(Object.assign(new DetranResult, cnh));
      
    } catch (e) {
      await crawlerService.updateStatus(person.personId, 'detran', 'error');
      console.log(e);
    } finally {
      await driver.quit();
    }
  }
};
