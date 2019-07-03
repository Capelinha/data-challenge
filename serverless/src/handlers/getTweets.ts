import { APIGatewayProxyHandler } from "aws-lambda";
import { By } from "selenium-webdriver";
import { success, buildResponseError } from "../lib/amAPIGatewayProxyResult";
import { buildDriver } from "../lib/chromium";
import { Driver } from "selenium-webdriver/chrome";

export const handler: APIGatewayProxyHandler = async (event) => {
  
  event
  const driver: Driver = buildDriver();

  try {
    await driver.get('https://twitter.com/jairbolsonaro');
    const tweets = await driver.findElements(By.className('tweet'));

    let data = [];

    for(let tweet of tweets){
      const tweetText = await tweet.findElement(By.className('TweetTextSize')).getText();
      
      data.push({
        'tweetText' : tweetText,
      });
      
    }

    return success(data);

  }catch (e){
    console.log(e);
    return buildResponseError(e);
  } finally {
    await driver.quit();
  }
};
