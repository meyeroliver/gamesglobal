import * as fs from 'fs';
import * as path from 'path';
import { Matcher } from './match';
import { Person } from './personl';

async function main() {
  try {
    const userInput = process.argv.splice(2);
    const dirPath = path.join(__dirname, '../output.txt');
    if (fs.existsSync(dirPath)) {
      fs.unlinkSync(dirPath);
    }

    const matcherArr = await goodMatch(userInput);
    if (matcherArr?.length == 0) {
      throw `Unfortunately was not able to perform the matching algorithm with this set of data. \nPlease try another`;
    } else {
      console.log(await produceResult(matcherArr));
    }
  } catch (error) {
    console.log(error);
  }
}

async function goodMatch(userInput: Array<string>): Promise<Array<Matcher>> {
  const validate = validateUserInput(userInput);
  let fileData: Array<string>;
  let screenedFile: Array<string>;
  let genderArr: Array<Array<Person>> = [];
  let match: Matcher;
  let matchArr: Array<Matcher> = [];

  if (validate == null) {
    try {
      fileData = await parseFile(userInput[0]);
      screenedFile = screenFileDate(fileData, userInput[0]);
      genderArr = distinctGender(filterGender(screenedFile));

      for (let i = 0; i < genderArr[0].length; i++) {
        for (let j = 0; j < genderArr[1].length; j++) {
          match = new Matcher(genderArr[0][i], genderArr[1][j]);
          match.pairItUp();
          matchArr.push(match);
        }
      }

      matchArr.sort((a, b) => {
        if (a.intensity > b.intensity) {
          return -1;
        } else if (a.intensity == b.intensity) {
          if (a.male.name.localeCompare(b.male.name) == 0) {
            return a.female.name.localeCompare(b.female.name);
          } else {
            return a.male.name.localeCompare(b.male.name);
          }
        } else {
          return 1;
        }
      });

      return matchArr;
    } catch (error) {
      throw error;
    }
  } else {
    throw validate;
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

function removeDuplicates(persons: Array<Person>): Array<Person> {
  return persons.filter(
    (value, index, self) =>
      index ===
      self.findIndex((t) => t.name === value.name && t.gender === value.gender)
  );
}

function distinctGender(genderArr: Array<Array<Person>>): Array<Array<Person>> {
  let distinctGenderArr: Person[][] = [];

  const males = removeDuplicates(genderArr[0]);
  const females = removeDuplicates(genderArr[1]);

  distinctGenderArr.push(males);
  distinctGenderArr.push(females);

  return distinctGenderArr;
}

async function produceResult(result: Array<Matcher>): Promise<string> {
  const dirPath = path.join(__dirname, '../');

  try {
    const matcherResultsArr = result.map((r) => r.toString());
    const content = matcherResultsArr.reduce((l1, l2) => {
      return l1.toString().concat('\r\n').concat(l2.toString());
    });
    fs.writeFileSync(dirPath.concat('output.txt'), content);
    return `The result of the matches has been created and can be found here: ${dirPath.concat(
      'output.txt'
    )}`;
  } catch (error) {
    throw error;
  }
}

async function parseFile(filename: string): Promise<Array<string>> {
  try {
    const dirPath = path.join(__dirname, '../');
    const data = fs.readFileSync(dirPath.concat(filename), 'utf8');
    return data.split('\r\n');
  } catch (error) {
    throw `This file ${error.path} does not exist.`;
  }
}

function validateUserInput(userInput: Array<string>): string {
  if (userInput.length == 1) {
    const file = userInput[0].split('.');
    if (file.length == 2 && file[1] === 'csv') {
      return null;
    } else {
      throw 'Invalid File type. Required file is a (.csv) .Please try again.';
    }
  } else {
    throw 'Invalid number of arguments. Please try again with 1 argument (e.g file.csv).';
  }
}

function screenFileDate(
  fileData: Array<string>,
  filename: string
): Array<string> {
  let fileLineArr: Array<string>;
  let screenedFile: Array<string> = [];

  if (fileData.length <= 1) {
    throw `The following file [${filename}] contains too little data.`;
  }

  for (let i = 0; i < fileData.length; i++) {
    fileLineArr = fileData[i].split(',');
    if (fileLineArr.length == 2) {
      if (isAlpha(fileLineArr[0].trim()) && validateGender(fileLineArr[1])) {
        screenedFile.push(fileData[i]);
      }
    } else {
      throw `The following file [${filename}] contains an invalid file structure`;
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

/* process.on('uncaughtException', (err) => {
  console.log(
    'An unforseen error has occured. \n Error has been reported and will be seen to.',
    err
  );
  process.exit(1);
}); */

main();
