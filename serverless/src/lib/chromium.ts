import { ServiceBuilder, Options, Driver } from "selenium-webdriver/chrome";

const HEADLESS_CHROME_PATH = '/opt/headless-chromium';
const CHROMEDRIVER_PATH = '/opt/chromedriver';

export const buildDriver = () => {
  
  let service = new ServiceBuilder(CHROMEDRIVER_PATH).build();

  const options = new Options();

  options.setChromeBinaryPath(HEADLESS_CHROME_PATH);
  options.addArguments(
    'headless',
    'disable-gpu',
    'window-size=800x600',
    'no-sandbox',
    'user-data-dir=/tmp/user-data',
    'hide-scrollbars',
    'enable-logging',
    'log-level=0',
    'v=99',
    'single-process',
    'data-path=/tmp/data-path',
    'ignore-certificate-errors',
    'homedir=/tmp',
    'disk-cache-dir=/tmp/cache-dir'
  );
  
  const driver = Driver.createSession(options, service);

  return driver;
}
