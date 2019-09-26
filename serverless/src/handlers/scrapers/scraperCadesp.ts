import { SNSEvent, SNSHandler } from "aws-lambda";
import { By } from 'selenium-webdriver';
import { Driver } from "selenium-webdriver/chrome";
import { buildDriver } from "../../lib/chromium";
import { Person } from "../../models/person";
import { CadespResult } from './../../models/cadespResult';
import { CrawlerService } from './../../services/crawlerService';

export const handler: SNSHandler = async (event: SNSEvent) => {

  for (const record of event.Records) {
    const person: Person = Object.assign(new Person, JSON.parse(record.Sns.Message));

    const driver: Driver = buildDriver();

    const crawlerService = new CrawlerService();

    try {
      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/cadesp/login.html');
      await driver.findElement(By.id('ctl00_conteudoPaginaPlaceHolder_loginControl_UserName')).click();
      await driver.findElement(By.id('ctl00_conteudoPaginaPlaceHolder_loginControl_UserName')).sendKeys('USUARIO');

      await driver.findElement(By.id('ctl00_conteudoPaginaPlaceHolder_loginControl_Password')).click();
      await driver.findElement(By.id('ctl00_conteudoPaginaPlaceHolder_loginControl_Password')).sendKeys('SENHA');

      await driver.findElement(By.id('ctl00_conteudoPaginaPlaceHolder_loginControl_loginButton')).click();

      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/cadesp/pagina3-pesquisa.html');

      await driver.findElement(By.id('ctl00_conteudoPaginaPlaceHolder_tcConsultaCompleta_TabPanel1_txtIdentificacao')).sendKeys(person.cnpj);
      await driver.executeScript('document.getElementById("ctl00_conteudoPaginaPlaceHolder_tcConsultaCompleta_TabPanel1_lstIdentificacao").setAttribute("value", 2)');
      await driver.findElement(By.id('ctl00_conteudoPaginaPlaceHolder_tcConsultaCompleta_TabPanel1_btnConsultarEstabelecimento')).click();
      
      const response = {
        ei: (await driver.findElement(By.xpath('//*[@id="ctl00_conteudoPaginaPlaceHolder_dlCabecalho"]/tbody/tr/td/table/tbody/tr[2]/td[2]')).getText()),
        cnpj: (await driver.findElement(By.xpath('//*[@id="ctl00_conteudoPaginaPlaceHolder_dlCabecalho"]/tbody/tr/td/table/tbody/tr[3]/td[2]')).getText()),
        businessName: (await driver.findElement(By.xpath('//*[@id="ctl00_conteudoPaginaPlaceHolder_dlCabecalho"]/tbody/tr/td/table/tbody/tr[4]/td[2]')).getText()),
        drt: (await driver.findElement(By.xpath('//*[@id="ctl00_conteudoPaginaPlaceHolder_dlCabecalho"]/tbody/tr/td/table/tbody/tr[5]/td[2]')).getText()),
        situation: (await driver.findElement(By.xpath('//*[@id="ctl00_conteudoPaginaPlaceHolder_dlCabecalho"]/tbody/tr/td/table/tbody/tr[2]/td[3]')).getText()).split(':')[1],
        dateRegistration: (await driver.findElement(By.xpath('//*[@id="ctl00_conteudoPaginaPlaceHolder_dlCabecalho"]/tbody/tr/td/table/tbody/tr[3]/td[3]')).getText()).split(':')[1],
        stateRegime: (await driver.findElement(By.xpath('//*[@id="ctl00_conteudoPaginaPlaceHolder_dlCabecalho"]/tbody/tr/td/table/tbody/tr[4]/td[3]')).getText()).split(':')[1],
        fiscalPoint: (await driver.findElement(By.xpath('//*[@id="ctl00_conteudoPaginaPlaceHolder_dlCabecalho"]/tbody/tr/td/table/tbody/tr[5]/td[3]')).getText()).split(':')[1],
        fancyName: (await driver.findElement(By.xpath('//*[@id="ctl00_conteudoPaginaPlaceHolder_dlEstabelecimentoGeral"]/tbody/tr[2]/td/table/tbody/tr[2]/td[2]')).getText()), 
        nire: (await driver.findElement(By.xpath('//*[@id="ctl00_conteudoPaginaPlaceHolder_dlEstabelecimentoGeral_ctl01_lnkNire"]')).getText()),
        taxOccurrence: (await driver.findElement(By.xpath('//*[@id="ctl00_conteudoPaginaPlaceHolder_dlEstabelecimentoGeral"]/tbody/tr[2]/td/table/tbody/tr[8]/td[2]')).getText()),
        unitType: (await driver.findElement(By.xpath('//*[@id="ctl00_conteudoPaginaPlaceHolder_dlEstabelecimentoGeral"]/tbody/tr[2]/td/table/tbody/tr[10]/td[2]')).getText()),
        waysOfActing: (await driver.findElement(By.xpath('//*[@id="ctl00_conteudoPaginaPlaceHolder_dlEstabelecimentoGeral_ctl01_dlEstabelecimentoFormasAtuacao"]/tbody/tr/td/table/tbody/tr/td')).getText()),
        personId: person.personId
      };

      await crawlerService.updateStatus(person.personId, 'cadesp', 'finished');
      await crawlerService.createResult(Object.assign(new CadespResult, response));

    } catch (e) {
      await crawlerService.updateStatus(person.personId, 'cadesp', 'error');
      console.log(e);
    } finally {
      await driver.quit();
    }
  }
};

