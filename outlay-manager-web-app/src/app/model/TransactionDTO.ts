export class TransactionDTO {
    id: number = 0 ;
    amount: number = 0;
    date: Date = new Date();
    description: string = "";
    codeTransactionID: number = 0;
    codeTransaction: string = "";
    typeTransactionID: number = 0;
    typeTransaction: string = "";

    constructor() {

    }
}
