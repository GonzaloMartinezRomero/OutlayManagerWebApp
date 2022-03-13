import { __decorate } from "tslib";
import { Component, ViewChild } from "@angular/core";
import { BaseChartDirective } from "ng2-charts";
import { TransactionTypes } from "../../model/TransactionTypes";
import { TransactionOperations } from "../../utils/transactionOperations";
let ResumeMonthExpenses = class ResumeMonthExpenses {
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
        this.pieChartData = {
            labels: [],
            datasets: [{
                    data: []
                }]
        };
        this.pieChartType = 'pie';
    }
    loadResumeTransactions(transactionCalendarContainer) {
        var spendingsTransactionsMapAux = new Map();
        var transactionCalendarArray = transactionCalendarContainer.matrixCalendar;
        transactionCalendarArray.forEach(week => {
            week.forEach(day => {
                day.transactionArray.forEach(transactionAux => {
                    if (transactionAux.typeTransaction == TransactionTypes.SPENDING)
                        TransactionOperations.agregateTransacionAmount(spendingsTransactionsMapAux, transactionAux);
                });
            });
        });
        var spendingsTransactions = [...spendingsTransactionsMapAux.values()].sort(TransactionOperations.comparatorTransactionAmount);
        this.updateSpendingChart(spendingsTransactions);
    }
    updateSpendingChart(spendingsTransactions) {
        var _a;
        //Labels
        var transactionsCodes = new Array();
        spendingsTransactions.forEach(value => transactionsCodes.push(value.code));
        this.pieChartData.labels = transactionsCodes;
        //Amounts
        this.pieChartData.datasets[0].data = [];
        spendingsTransactions.forEach(value => this.pieChartData.datasets[0].data.push(value.amount));
        (_a = this.chartExpenses) === null || _a === void 0 ? void 0 : _a.update();
    }
};
__decorate([
    ViewChild(BaseChartDirective)
], ResumeMonthExpenses.prototype, "chartExpenses", void 0);
ResumeMonthExpenses = __decorate([
    Component({
        selector: "resumeMonthExpenses",
        templateUrl: "resumeMonthExpenses.component.html"
    })
], ResumeMonthExpenses);
export { ResumeMonthExpenses };
//# sourceMappingURL=resumeMonthExpenses.component.js.map