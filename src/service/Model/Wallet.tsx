export default class Wallet {
  name: String;
  type: String;
  balance: Number;

  constructor(name: String, type: String, balance: Number = 0) {
    this.name = name;
    this.type = type;
    this.balance = balance;
  }
}