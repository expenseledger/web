export default interface ITransaction {
  id: number;
  srcWallet: string;
  dstWallet: string;
  amount: number;
  type: string;
  category: string;
  description: string;
  date: Date;
}