import { AccountType } from "./../constants";
interface Account {
    id: number;
    name: string;
    type: AccountType;
    balance: number;
}

export default Account;
