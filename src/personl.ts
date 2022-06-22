export class Person {
  name: string;
  gender: string;

  constructor(name: string, gender: string) {
    this.name = name;
    this.gender = gender;
  }

  toString(): string {
    return `Person{name: ${this.name}, gender: ${this.gender}}`;
  }
}
