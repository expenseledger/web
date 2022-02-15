interface AddTransactionDto {
    amount: number;
    date: Date;
    note: string;
    account: string;
    [key: string]: string | number | Date;
}

export default AddTransactionDto;
