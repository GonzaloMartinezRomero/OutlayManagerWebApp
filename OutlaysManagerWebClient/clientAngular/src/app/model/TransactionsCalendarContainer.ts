import { TransactionDTO } from "./TransactionDTO";

export class TransactionsCalendarContainer {

    public weekDays: Array<string> = new Array<string>();
    public year: number = 0;
    public month: number = 0;
    public matrixCalendar: Array<Array<TransacionCalendar>> = new Array<Array<TransacionCalendar>>();
    public isError: boolean = false;
    public exceptionAPI: any = undefined;

    constructor() {  }
}

export class TransacionCalendar {
    public transactionArray: Array<TransactionDTO> = new Array<TransactionDTO>();
    public isTransactionAvailable: boolean = true;
    public day: number = 0;
    public isToday: boolean = false;
}





