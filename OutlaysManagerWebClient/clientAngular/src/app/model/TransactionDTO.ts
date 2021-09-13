export class TransactionDTO {
    id: number = 0 ;
    amount: number = 0;
    date: Date = new Date();
    detailTransaction: DetailTransaction = new DetailTransaction();

    constructor() {

    }
}

export class DetailTransaction {
    code: string ="";
    description: string = "";
    type: Type = Type.Adjust;
}

export enum Type {
    Adjust = "ADJUST",
    Incoming = "INCOMING",
    Spending = "SPENDING",
}

