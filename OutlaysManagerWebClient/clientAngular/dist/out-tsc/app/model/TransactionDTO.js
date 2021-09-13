export class TransactionDTO {
    constructor() {
        this.id = 0;
        this.amount = 0;
        this.date = new Date();
        this.detailTransaction = new DetailTransaction();
    }
}
export class DetailTransaction {
    constructor() {
        this.code = "";
        this.description = "";
        this.type = Type.Adjust;
    }
}
export var Type;
(function (Type) {
    Type["Adjust"] = "ADJUST";
    Type["Incoming"] = "INCOMING";
    Type["Spending"] = "SPENDING";
})(Type || (Type = {}));
//# sourceMappingURL=TransactionDTO.js.map