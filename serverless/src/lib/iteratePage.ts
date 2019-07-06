import { By } from "selenium-webdriver";
import { Driver } from "selenium-webdriver/chrome";

/**
 * Enum that represents the By type of findElement.
 */
export enum ByTypeEnum {
  CLASS_NAME = 1,
  XPATH = 2,
  CSS = 3,
  ID = 4
}

/**
 * Enum that represents the By type of findElement.
 */
export interface IParentData {
  name: string,
  type: ByTypeEnum,
  selector: string,
  children? : IParentData[]
}

/**
 * Function that iterate over a webdriver client and extract the data requested in parentData.
 * @param parent object that represent the webdriver client.
 * @param parentData object that represent the data that want to extract of parent webdriver.
 * @param build boolean that format the return data to a object.
 */
export const iterateElementData = async (parent: Driver, parentData: IParentData[], build: boolean) => {

  let response = [];

  for (let childData of parentData) {

    let childResponse = {
      name: childData.name,
      value: []
    };

    let childElements;
    switch (childData.type) {
      case 1:
        childElements = await parent.findElements(By.className(childData.selector));
        break;
      case 2:
        childElements = await parent.findElements(By.xpath(childData.selector));
        break;
      case 3:
        childElements = await parent.findElements(By.css(childData.selector));
        break;
      case 4:
        childElements = await parent.findElements(By.id(childData.selector));
        break;
    }
    for (let child of childElements) {

      if (childData.children === undefined) {
        childResponse.value = (await child.getText());
      } else {
        childResponse.value.push(await iterateElementData(child, childData.children, false));
      }
    }

    response.push(childResponse);
  }

  return build ? _buildObject(response)[0] : response;
}

const _arrayToObject = (array) => {

  const newObject = {};

  for (let item of array) {
    const auxObject = {};
    auxObject[item.name] = item.value;
    Object.assign(newObject, auxObject);
  }
  return newObject;
}

const _buildObject = (response) => {

  return response.map((e) => {
    const newObject = {};
    if (Array.isArray(e)) {
      return _arrayToObject(e);
    } else {
      if (Array.isArray(e.value)) {
        newObject[e.name] = _buildObject(e.value);
      } else {
        newObject[e.name] = e.value;
      }

    }
    return newObject;
  });
}