import { SNSEvent, SNSHandler } from "aws-lambda";
import { By } from 'selenium-webdriver';
import { Driver } from "selenium-webdriver/chrome";
import { buildDriver } from "../../lib/chromium";
import { Person } from "../../models/person";
import { CagedResult } from "../../models/cagedResult";
import { CrawlerService } from "../../services/crawlerService";

export const handler: SNSHandler = async (event: SNSEvent) => {

  for (const record of event.Records) {
    const person: Person = Object.assign(new Person, JSON.parse(record.Sns.Message));

    const driver: Driver = buildDriver();

    const crawlerService = new CrawlerService();

    try {
      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/caged/login.html');
      
      await driver.findElement(By.id('username')).click();
      await driver.findElement(By.id('username')).sendKeys('USUARIO');

      await driver.findElement(By.id('password')).click();
      await driver.findElement(By.id('password')).sendKeys('SENHA');

      await driver.findElement(By.id('btn-submit')).click();
      
      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/caged/pagina3-consulta-autorizado-responsavel.html');
      
      await driver.findElement(By.id('formPesquisarAutorizado:txtChavePesquisaAutorizado014')).click();
      await driver.findElement(By.id('formPesquisarAutorizado:txtChavePesquisaAutorizado014')).sendKeys(person.cnpj);

      await driver.findElement(By.id('formPesquisarAutorizado:bt027_8')).click();

      const company = {
        socialReason: await driver.findElement(By.id('txtrazaosocial020_4')).getText(),
        address: {
          street: await driver.findElement(By.id('txt3_logradouro020')).getText(),
          neighborhood: await driver.findElement(By.id('txt4_bairro020')).getText(),
          municipality: await driver.findElement(By.id('txt6_municipio020')).getText(),
          state: await driver.findElement(By.id('txt7_uf020')).getText(),
          cep: await driver.findElement(By.id('txt8_cep020')).getText(),
        },
        contact: {
          name: await driver.findElement(By.id('txt_nome_contato')).getText(),
          cpf: await driver.findElement(By.id('txt_contato_cpf')).getText(),
          ddd: await driver.findElement(By.id('txt21_ddd020')).getText(),
          phoneNumber: await driver.findElement(By.id('txt9_telefone020')).getText(),
          email: await driver.findElement(By.id('txt11_email')).getText(),
          branch: await driver.findElement(By.id('txt10_ramal020')).getText(),
        },
        infos: {}
      }

      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/caged/pagina4-consulta-empresa.html');

      await driver.findElement(By.id('formPesquisarEmpresaCAGED:txtcnpjRaiz')).click();
      await driver.findElement(By.id('formPesquisarEmpresaCAGED:txtcnpjRaiz')).sendKeys(person.cnpj.slice(0,5));

      await driver.findElement(By.id('formPesquisarEmpresaCAGED:btConsultar')).click();

      company.infos = {
        economicActivity: await driver.findElement(By.id('formResumoEmpresaCaged:txtDescricaoAtividadeEconomica')).getText(),
        branches: await driver.findElement(By.id('formResumoEmpresaCaged:txtNumFiliais')).getText(),
        admissions: await driver.findElement(By.id('formResumoEmpresaCaged:txtTotalNumAdmissoes')).getText(),
        links: await driver.findElement(By.id('formResumoEmpresaCaged:txtTotalVinculos')).getText(),
        shutdowns: await driver.findElement(By.id('formResumoEmpresaCaged:txtTotalNumDesligamentos')).getText(),
      };

      await driver.get('http://ec2-18-231-116-58.sa-east-1.compute.amazonaws.com/caged/pagina6-consulta-trabalhador.html');
      await driver.findElement(By.id('formPesquisarTrabalhador:txtChavePesquisa')).click();
      await driver.findElement(By.id('formPesquisarTrabalhador:txtChavePesquisa')).sendKeys(person.cpf);

      await driver.executeScript('document.getElementById("formPesquisarTrabalhador:slctTipoPesquisaTrabalhador").setAttribute("value", 2)');

      await driver.findElement(By.id('formPesquisarTrabalhador:submitPesqTrab')).click();

      const personal = {
        pis: await driver.findElement(By.id('txt1_Pis028')).getText(),
        ctps: await driver.findElement(By.id('txt5_Ctps027')).getText(),
        pisSituation: await driver.findElement(By.id('txt4_SitPis027')).getText(),
        educationDegree: await driver.findElement(By.id('txt12_Instr027')).getText(),
        deficiency: await driver.findElement(By.id('txt13_Def027')).getText(),
        nationality: await driver.findElement(By.id('txt8_Nac027')).getText(),
        gender: await driver.findElement(By.id('txt6_Sexo027')).getText(),
        birthday: await driver.findElement(By.id('txt4_datanasc027')).getText(),
        color: await driver.findElement(By.id('txt10_Raca027')).getText(),
        cagedWorkTime: await driver.findElement(By.id('txt26_Caged027')).getText(),
        raisWorkTime: await driver.findElement(By.id('txt27_Rais027')).getText(),
        works: []
      };

      const rows = await driver.findElements(By.css('.oddRows, .evenRows'));

      for (const row of rows) {
        personal.works.push({
          company: (await row.findElement(By.css('td:nth-child(2)')).getText()),
          cnpj: (await row.findElement(By.css('td:nth-child(3)')).getText()),
          start: (await row.findElement(By.css('td:nth-child(5)')).getText()),
          end: (await row.findElement(By.css('td:nth-child(6)')).getText()),
          situation: (await row.findElement(By.css('td:nth-child(7)')).getText()),
        });
      }

      const result = {
        personId: person.personId,
        company,
        personal
      }
      
      console.log(JSON.stringify(result));
      await crawlerService.updateStatus(person.personId, 'caged', 'finished');
      await crawlerService.createResult(Object.assign(new CagedResult, result));
      
    } catch (e) {
      await crawlerService.updateStatus(person.personId, 'caged', 'error');
      console.log(e);
    } finally {
      await driver.quit();
    }
  }
};
