import { promises as fs } from 'fs';
import * as path from 'path';
import { Matcher } from './match';
import { Person } from './personl';

async function main() {
  const userInput = process.argv.splice(2);
  await goodMatch(userInput);
}

async function goodMatch(userInput: Array<string>): Promise<string> {
  const validate = validateUserInput(userInput);
  let fileData: Array<string>;
  let screenedFile: Array<string>;
  let genderArr: Array<Array<Person>> = [];

  let userInputConcat: string;
  let inputSet: Array<string>;
  let tempStr: string;
  let match: Matcher;

  if (validate == null) {
    fileData = await parseFile();
    screenedFile = screenFileDate(fileData);
    genderArr = distinctGender(filterGender(screenedFile));
    for (let i = 0; i < genderArr[0].length; i++) {
      for (let j = 0; j < genderArr[1].length; j++) {
        match = new Matcher(genderArr[0][i], genderArr[1][j]);
        match.pairItUp();
        console.log(match.toString());
      }
    }

    return 'awe';
  } else {
    return validate;
  }
}

function filterGender(fileData: Array<string>): Array<Array<Person>> {
  let genderArr: Array<Array<Person>> = [];
  let male: Array<Person> = [];
  let female: Array<Person> = [];
  let person: Person;
  let temp: Array<string>;

  for (let i = 0; i < fileData.length; i++) {
    temp = fileData[i].split(',');
    person = new Person(temp[0], temp[1]);
    if (typeof person != 'undefined' && isMale(person.gender)) {
      male.push(person);
    } else if (typeof person != 'undefined' && isfemale(person.gender)) {
      female.push(person);
    }
  }
  genderArr.push(male);
  genderArr.push(female);
  return genderArr;
}

function distinctGender(genderArr: Array<Array<Person>>): Array<Array<Person>> {
  const maleSet = new Set(genderArr[0]);
  const femaleSet = new Set(genderArr[1]);
  let distinctGenderArr: Person[][] = [];
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
