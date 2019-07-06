import { SNSHandler } from "aws-lambda";
import { By } from "selenium-webdriver";
import { Driver } from "selenium-webdriver/chrome";
import { buildDriver } from "../../lib/chromium";

export const handler: SNSHandler = async (event) => {

  event
  const driver: Driver = buildDriver();

  try {
    await driver.get('https://twitter.com/jairbolsonaro');
    const tweets = await driver.findElements(By.className('tweet'));

    let data = [];

    for (let tweet of tweets) {
      const tweetText = await tweet.findElement(By.className('TweetTextSize')).getText();

      data.push({
        'tweetText': tweetText,
      });

    }

    console.log(data);

  } catch (e) {
    console.log(e);
  } finally {
    await driver.quit();
  }
};
