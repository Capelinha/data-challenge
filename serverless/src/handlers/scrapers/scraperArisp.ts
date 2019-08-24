import { ArispResult } from './../../models/arispResult';
import { SNSEvent, SNSHandler } from "aws-lambda";
import { S3 } from "aws-sdk";
import { By } from 'selenium-webdriver';
import { Driver } from "selenium-webdriver/chrome";
import * as uuid from 'uuid';
import { buildDriver } from "../../lib/chromium";
import { Person } from "../../models/person";
import { CrawlerService } from "../../services/crawlerService";


export const handler: SNSHandler = async (event: SNSEvent) => {

  for (const record of event.Records) {
    const person: Person = Object.assign(new Person, JSON.parse(record.Sns.Message));

    const driver: Driver = buildDriver();

    try {
      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/arisp/login.html');
      await driver.findElement(By.id('btnCallLogin')).click();
      await driver.findElement(By.id('btnAutenticar')).click();
      
      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/arisp/pagina5-escolha-regiao.html');
      const chk = await driver.findElement(By.id('chkHabilitar'));
      await driver.executeScript("arguments[0].click();", chk);
      await driver.findElement(By.className('subTitle')).click();
      
      const btn = await driver.findElement(By.css('#Prosseguir.pull-right'));
      await driver.executeScript("arguments[0].click();", btn);

      await driver.findElement(By.id('filterDocumento')).sendKeys(person.cpf);
      await driver.findElement(By.id('btnPesquisar')).click();

      const btn2 = await driver.findElement(By.id('btnSelecionarTudo'));
      await driver.executeScript("arguments[0].click();", btn2);
      
      const btn3 = await driver.findElement(By.id('btnProsseguir'));
      await driver.executeScript("arguments[0].click();", btn3);

      let rows = await driver.findElements(By.css('#panelMatriculas>tr'));

      const result = {
        personId: person.personId,
        records: []
      }

      for (let i = 1; i<rows.length; i++) {
        
        const row = rows[i];

        const city = await (await row.findElement(By.css('td:nth-child(1)'))).getText();
        const registry = await (await row.findElement(By.css('td:nth-child(2)'))).getText();
        const enrollment = await (await row.findElement(By.css('td:nth-child(3)'))).getText();
        
        const fileUrl = (await row.findElement(By.css('a')));
        await driver.executeScript("arguments[0].click();", fileUrl);
        await driver.switchTo().window((await driver.getAllWindowHandles())[i]);

        const Key = `${uuid.v4()}.png`;
        const Bucket = 'am-images-bucket-dev';

        const Body = Buffer.from(await driver.takeScreenshot(), 'base64');

        (new S3()).putObject({
          Body,
          Key,
          Bucket,
          ContentType: 'image/png'
        }, (err, data) => {
          if (err) {
            console.error(err);
          } else {
            console.log(data);
          }
        });

        result.records.push({
          city,
          registry,
          enrollment,
          filename: Key
        });

        await driver.switchTo().window((await driver.getAllWindowHandles())[0]);
      }

      console.log(JSON.stringify(result));
      await new CrawlerService().createResult(Object.assign(new ArispResult, result));
      
    } catch (e) {
      console.log(e);
    } finally {
      await driver.quit();
    }
  }
};
