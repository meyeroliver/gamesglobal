import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
  const userInput = process.argv.splice(2);
  await goodMatch(userInput);
}

async function goodMatch(userInput: Array<string>): Promise<string> {
  const validate = validateUserInput(userInput);
  let fileData: Array<string>;
  let screenedFile: Array<string>;
  let genderArr: Array<Array<string>> = [];

  let userInputConcat: string;
  let inputSet: Array<string>;
  let tempStr: string;

  if (validate == null) {
    /* userInputConcat = userInput[0] + 'matches' + userInput[1];
    inputSet = Array.from(new Set(userInputConcat));
    tempStr = countRepeatChars(userInputConcat, inputSet);
    return resultStr(userInput, Number(numStrReducer(tempStr))); */
    fileData = await parseFile();
    screenedFile = screenFileDate(fileData);
    genderArr = distinctGender(filterGender(screenedFile));
    return 'awe';
  } else {
    return validate;
  }
}

function filterGender(fileData: Array<string>): Array<Array<string>> {
  let genderArr: Array<Array<string>> = [];
  let male: Array<string> = [];
  let female: Array<string> = [];
  let player: Array<string> = [];

  console.log(fileData);
  for (let i = 0; i < fileData.length; i++) {
    player = fileData[i].split(',');
    if (typeof player != 'undefined' && isMale(player[1])) {
      male.push(player[0]);
    } else if (typeof player != 'undefined' && isfemale(player[1])) {
      female.push(player[0]);
    }
  }
  genderArr.push(male);
  genderArr.push(female);
  return genderArr;
}

function distinctGender(genderArr: Array<Array<string>>): Array<Array<string>> {
  const maleSet = new Set(genderArr[0]);
  const femaleSet = new Set(genderArr[1]);
  let distinctGenderArr: string[][] = [];
  distinctGenderArr[0] = Array.from(maleSet);
  distinctGenderArr[1] = Array.from(femaleSet);
  return distinctGenderArr;
}

async function parseFile(): Promise<Array<string>> {
  try {
    const dirPath = path.join(__dirname, '../');
    const data = await fs.readFile(
      dirPath.concat('testfile-Sheet1.csv'),
      'utf8'
    );
    return data.split('\r\n');
  } catch (err) {
    return err;
  }
}

function resultStr(userInput: Array<string>, match: number): string {
  let str = `${userInput[0]} matches ${userInput[1]} ${match}%`;
  if (match >= 80) {
    str += ', good match';
  }
  return str;
}

function numStrReducer(numStr: string): string {
  let newStr = '';
  let num: number;
  let rightIn = 1;
  let loopLength: number;
  if (numStr.length == 2) {
    return numStr;
  } else {
    loopLength = determineLoopLength(numStr.length);
    for (let i = 0; i < loopLength; i++) {
      if (i == loopLength - 1 && !isOdd(loopLength)) {
        newStr += numStr[loopLength - 1];
      } else {
        num = Number(numStr[i]) + Number(numStr[numStr.length - rightIn]);
        rightIn++;
        newStr += num;
      }
    }
    return numStrReducer(newStr);
  }
}

function determineLoopLength(num: number): number {
  let loopLength = 0;
  if (isOdd(num)) {
    loopLength = Math.round(num / 2);
  } else {
    loopLength = num / 2;
  }
  return loopLength;
}

function isOdd(num: number): boolean {
  return num % 2 == 1 ? true : false;
}

function countRepeatChars(userStr: String, inputSet: Array<string>): string {
  let matchNumString = '';
  let num = 0;
  for (let i = 0; i < inputSet.length; i++) {
    num = 0;
    for (let j = 0; j < userStr.length; j++) {
      if (inputSet[i].toLowerCase() === userStr[j].toLowerCase()) {
        num++;
      }
    }
    matchNumString += num;
  }
  return matchNumString;
}

function validateUserInput(userInput: Array<string>): string {
  if (userInput.length == 1) {
    const file = userInput[0].split('.');
    if (file.length == 2 && file[1] === 'csv') {
      return null;
    } else {
      return 'Invalid File type. Required file is a (.csv) .Please try again.';
    }
  } else {
    return 'Invalid number of arguments. Please try again with 1 argument (e.g file.csv).';
  }
}

function screenFileDate(fileData: Array<string>): Array<string> {
  let fileLineArr: Array<string>;
  let screenedFile: Array<string> = [];
  for (let i = 0; i < fileData.length; i++) {
    fileLineArr = fileData[i].split(',');
    if (fileLineArr.length == 2) {
      if (isAlpha(fileLineArr[0].trim()) && validateGender(fileLineArr[1])) {
        screenedFile.push(fileData[i]);
      }
    }
  }
  return screenedFile;
}

function validateGender(gender: string): boolean {
  return isMale(gender) || isfemale(gender) ? true : false;
}

function isMale(gender: string): boolean {
  return gender.toLowerCase() === 'm' ? true : false;
}

function isfemale(gender: string): boolean {
  return gender.toLowerCase() === 'f' ? true : false;
}

function isAlpha(str: string): boolean {
  return /^[a-zA-Z]+$/.test(str);
}

main();
