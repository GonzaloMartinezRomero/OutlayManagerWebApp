import { __decorate } from "tslib";
import { Component, ViewChild } from "@angular/core";
import { ResumeMonthTransacion } from "../../model/ResumeMonthTransaction";
import { TransactionTypes } from "../../model/TransactionTypes";
let ResumeMonthTransactions = class ResumeMonthTransactions {
    constructor() {
        this.pieChartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                },
            },
            normalized: true
        };
        this.pieChartOptionsIncoming = {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                },
            },
            normalized: true
        };
        this.pieChartDataExpenses = {
            labels: [],
            datasets: [{
                    data: []
                }]
        };
        this.pieChartDataIncomings = {
            labels: [],
            datasets: [{
                    data: []
                }]
        };
        this.pieChartType = 'pie';
        this.pieChartTypeIncoming = 'pie';
    }
    loadResumeTransactions(transactionCalendarContainer) {
        var _a, _b;
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
        var spendingsTransactions = [...spendingsTransactionsMapAux.values()].sort(this.comparatorTransactionMapValue);
        this.updateSpendingChar(spendingsTransactions);
        var incomingTransactions = [...incomingsransactionsMapAux.values()].sort(this.comparatorTransactionMapValue);
        this.updateIncomingChar(incomingTransactions);
        console.log("EXPENSES");
        console.log(this.chartExpenses);
        console.log("INCOMGINS");
        console.log(this.chartIncomings);
        (_a = this.chartExpenses) === null || _a === void 0 ? void 0 : _a.update();
        (_b = this.chartIncomings) === null || _b === void 0 ? void 0 : _b.update();
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
    updateSpendingChar(spendingsTransactions) {
        //Labels
        var transactionsCodes = new Array();
        spendingsTransactions.forEach(value => transactionsCodes.push(value.code));
        this.pieChartDataExpenses.labels = transactionsCodes;
        //Amounts
        this.pieChartDataExpenses.datasets[0].data = [];
        spendingsTransactions.forEach(value => this.pieChartDataExpenses.datasets[0].data.push(value.amount));
    }
    updateIncomingChar(incomingsTransactions) {
        //Labels
        var transactionsCodes = new Array();
        incomingsTransactions.forEach(value => transactionsCodes.push(value.code));
        this.pieChartDataIncomings.labels = transactionsCodes;
        //Amounts
        this.pieChartDataIncomings.datasets[0].data = [];
        incomingsTransactions.forEach(value => this.pieChartDataIncomings.datasets[0].data.push(value.amount));
    }
};
__decorate([
    ViewChild("chartExpenses")
], ResumeMonthTransactions.prototype, "chartExpenses", void 0);
__decorate([
    ViewChild("chartIncomings")
], ResumeMonthTransactions.prototype, "chartIncomings", void 0);
ResumeMonthTransactions = __decorate([
    Component({
        selector: "resumeMonthTransactions",
        templateUrl: "resumeMonthTransactions.component.html"
    })
], ResumeMonthTransactions);
export { ResumeMonthTransactions };
//# sourceMappingURL=resumeMonthTransactions.component.js.map