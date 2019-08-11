import { SNSEvent, SNSHandler } from "aws-lambda";
import { By, Actions } from 'selenium-webdriver';
import { Driver } from "selenium-webdriver/chrome";
import { buildDriver } from "../../lib/chromium";
import { Person } from "../../models/person";

export const handler: SNSHandler = async (event: SNSEvent) => {

  for (const record of event.Records) {
    const person: Person = Object.assign(new Person, JSON.parse(record.Sns.Message));

    const driver: Driver = buildDriver();

    try {
      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/arisp/login.html');
      await driver.findElement(By.id('btnCallLogin')).click();
      await driver.findElement(By.id('btnAutenticar')).click();
      
      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/arisp/pagina5-escolha-regiao.html');
      await driver.findElement(By.css('.checkbox>input')).click();
      await driver.findElement(By.className('subTitle')).click();
      
      await new Actions(driver).mouseMove(await driver.findElement(By.id('Prosseguir')));


      await driver.findElement(By.id('filterDocumento')).sendKeys(person.cpf);
      await driver.findElement(By.id('btnPesquisar')).click();

      await driver.findElement(By.id('btnSelecionarTudo')).click();
      await driver.findElement(By.id('btnProsseguir')).click();

      const rows = await driver.findElements(By.css('tbody>tr'));

      for (const row of rows) {
        // const city = (await row.findElement(By.css('td:nth-child(1)'))).getText();
        // const registry = (await row.findElement(By.css('td:nth-child(2)'))).getText();
        // const enrollment = (await row.findElement(By.css('td:nth-child(3)'))).getText();
        const fileUrl = (await row.findElement(By.css('td:nth-child(4)')));
        await fileUrl.click();

        console.log(await driver.takeScreenshot());

        await driver.navigate().back();

        console.log(await driver.takeScreenshot());
      }
      
    } catch (e) {
      console.log(e);
    } finally {
      await driver.quit();
    }
  }
};
