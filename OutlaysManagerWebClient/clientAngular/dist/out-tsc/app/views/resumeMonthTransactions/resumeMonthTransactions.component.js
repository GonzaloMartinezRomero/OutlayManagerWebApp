import { __decorate } from "tslib";
import { Component } from "@angular/core";
import { ResumeMonthTransacion } from "../../model/ResumeMonthTransaction";
import { TransactionTypes } from "../../model/TransactionTypes";
let ResumeMonthTransactions = class ResumeMonthTransactions {
    constructor() {
        this.spendingsTransactions = new Array();
        this.incomingTransactions = new Array();
    }
    loadResumeTransactions(transactionCalendarContainer) {
        var spendingsTransactionsMapAux = new Map();
        var incomingsransactionsMapAux = new Map();
        var transactionCalendarArray = transactionCalendarContainer.matrixCalendar;
        transactionCalendarArray.forEach(week => {
            week.forEach(day => {
                day.transactionArray.forEach(transactionAux => {
                    if (transactionAux.typeTransaction == TransactionTypes.SPENDING) {
                        this.aggregateValue(spendingsTransactionsMapAux, transactionAux);
                    }
                    else {
                        this.aggregateValue(incomingsransactionsMapAux, transactionAux);
                    }
                });
            });
        });
        this.spendingsTransactions = [...spendingsTransactionsMapAux.values()].sort(this.comparatorTransactionMapValue);
        this.incomingTransactions = [...incomingsransactionsMapAux.values()].sort(this.comparatorTransactionMapValue);
    }
    aggregateValue(collectionMap, transaction) {
        var _a, _b;
        var trCode = transaction.codeTransaction;
        if (collectionMap.has(trCode)) {
            var totalAmount = ((_b = (_a = collectionMap === null || collectionMap === void 0 ? void 0 : collectionMap.get(trCode)) === null || _a === void 0 ? void 0 : _a.amount) !== null && _b !== void 0 ? _b : 0) + transaction.amount;
            totalAmount = Math.round(totalAmount * 100) / 100;
            var updatedTransaction = new ResumeMonthTransacion();
            updatedTransaction.code = trCode;
            updatedTransaction.amount = totalAmount;
            collectionMap.set(trCode, updatedTransaction);
        }
        else {
            var newTransaction = new ResumeMonthTransacion();
            newTransaction.code = trCode;
            newTransaction.amount = transaction.amount;
            collectionMap.set(trCode, newTransaction);
        }
    }
    comparatorTransactionMapValue(a, b) {
        return (a.amount - b.amount) * -1;
    }
};
ResumeMonthTransactions = __decorate([
    Component({
        selector: "resumeMonthTransactions",
        templateUrl: "resumeMonthTransactions.component.html",
        styleUrls: ["TransactionTableStyle.css"]
    })
], ResumeMonthTransactions);
export { ResumeMonthTransactions };
//# sourceMappingURL=resumeMonthTransactions.component.js.map