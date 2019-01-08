export default class Wallet {
  public name: string;
  public type: string;
  public balance: number;

  constructor(name: string, type: string, balance: number = 0) {
    this.name = name;
    this.type = type;
    this.balance = balance;
  }
}