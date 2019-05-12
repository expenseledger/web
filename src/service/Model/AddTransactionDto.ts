export default interface AddTransactionDto {
  amount: number;
  date: Date;
  note: string;
  wallet: string;
  [key: string]: string | number | Date;
}
