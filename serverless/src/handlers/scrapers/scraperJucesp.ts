import { SNSEvent, SNSHandler } from "aws-lambda";
import * as request from 'request-promise-native';
import { Driver } from "selenium-webdriver/chrome";
import { buildDriver } from "../../lib/chromium";
import { Person } from "../../models/person";
import { CrawlerService } from '../../services/crawlerService';
import { JucespResult } from './../../models/jucespResult';

export const handler: SNSHandler = async (event: SNSEvent) => {

  for (const record of event.Records) {
    const person: Person = Object.assign(new Person, JSON.parse(record.Sns.Message));

    const driver: Driver = buildDriver();

    try {

      const baseUrl = 'https://www.jucesponline.sp.gov.br/GeoJson.aspx';
      const queryString = person.cnpj ? `?cnpj=${person.cnpj}&hits=10` : `?razao=${person.companyName}&hits=10`;
      const options = {
          uri: baseUrl + queryString,
      };

      const apiResponse = JSON.parse(await request.get(options));

      const companies = apiResponse.featureCollection.features;

      const response = [];

      for (const company of companies) {
        const data = {
          cep: company.properties.CEP,
          cnpj: company.properties.CNPJ,
          address: company.properties.Endereco,
          type: company.properties.Enquadramento,
          nire: company.properties.NIRE,
          object: company.properties.Objeto,
          name: company.properties.Razao,
          personId: person.personId
        };
        response.push(data);      
      }

      await new CrawlerService().createResult(Object.assign(new JucespResult, { companies: response, personId: person.personId }));

      for (const company of response) {
        await driver.get(`https://www.jucesponline.sp.gov.br/Restricted/GeraDocumento.aspx?nire=${company.nire}&tipoDocumento=1`);
      }
      
    } catch (e) {
      console.log(e);
    } finally {
      await driver.quit();
    }
  }
};
