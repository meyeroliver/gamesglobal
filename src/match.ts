import { Person } from './personl';

export class Matcher {
  male: Person;
  female: Person;
  intensity: number;

  constructor(male: Person, female: Person) {
    this.male = male;
    this.female = female;
  }

  pairItUp() {
    const distinctLetterArr = Array.from(new Set(this.getMacthString()));
    const tempStr = this.countRepeatChars(
      this.getMacthString(),
      distinctLetterArr
    );
    this.intensity = Number(this.numStrReducer(tempStr));
  }

  toString() {
    let str = `${this.getMacthString()} ${this.intensity}%`;
    if (this.intensity >= 80) {
      str += ', good match';
    }
    return str;
  }

  getMacthString() {
    return `${this.male.name} matches ${this.female.name}`;
  }

  numStrReducer(numStr: string): string {
    let newStr = '';
    let num: number;
    let rightIn = 1;
    let loopLength: number;
    if (numStr.length == 2) {
      return numStr;
    } else {
      loopLength = this.determineLoopLength(numStr.length);
      for (let i = 0; i < loopLength; i++) {
        if (i == loopLength - 1 && !this.isOdd(loopLength)) {
          newStr += numStr[loopLength - 1];
        } else {
          num = Number(numStr[i]) + Number(numStr[numStr.length - rightIn]);
          rightIn++;
          newStr += num;
        }
      }
      return this.numStrReducer(newStr);
    }
  }

  determineLoopLength(num: number): number {
    let loopLength = 0;
    if (this.isOdd(num)) {
      loopLength = Math.round(num / 2);
    } else {
      loopLength = num / 2;
    }
    return loopLength;
  }

  isOdd(num: number): boolean {
    return num % 2 == 1 ? true : false;
  }

  countRepeatChars(userStr: String, inputSet: Array<string>): string {
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
}
