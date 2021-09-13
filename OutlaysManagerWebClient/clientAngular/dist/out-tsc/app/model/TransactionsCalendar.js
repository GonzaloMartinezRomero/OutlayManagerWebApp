export class TransactionsCalendar {
    constructor() {
        this.weekDays = new Array();
        this.year = 0;
        this.month = 0;
        this.matrixCalendar = new Array();
    }
}
export class Transaction {
    constructor(dayNumber) {
        this.day = undefined;
        this.transactions = new Array();
        this.day = dayNumber;
    }
}
//# sourceMappingURL=TransactionsCalendar.js.map