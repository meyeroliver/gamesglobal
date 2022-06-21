import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
  const userInput = process.argv.splice(2);
  console.log(goodMatch(userInput));
}

function goodMatch(userInput: Array<string>): string {
  const validate = validateUserInput(userInput);
  let userInputConcat: string;
  let inputSet: Array<string>;
  let tempStr: string;

  if (validate == null) {
    /* userInputConcat = userInput[0] + 'matches' + userInput[1];
    inputSet = Array.from(new Set(userInputConcat));
    tempStr = countRepeatChars(userInputConcat, inputSet);
    return resultStr(userInput, Number(numStrReducer(tempStr))); */
    parseFile();
    return 'awe';
  } else {
    return validate;
  }
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

function isAlpha(str: string): boolean {
  return /^[a-zA-Z]+$/.test(str);
}

main();
