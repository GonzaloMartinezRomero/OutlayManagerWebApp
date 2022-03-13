import { __decorate } from "tslib";
import { Component, ViewChild } from "@angular/core";
import { BaseChartDirective } from "ng2-charts";
import { TransactionTypes } from "../../utils/TransactionTypes";
let ResumeMonthTransaction = class ResumeMonthTransaction {
    constructor(apiService) {
        this.apiService = apiService;
        this.pieChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                },
            },
        };
        this.pieChartData = {
            labels: [],
            datasets: [{
                    data: []
                }]
        };
        this.pieChartType = 'pie';
    }
    loadTransactionsResume(year, month, loadExpenses) {
        var transactionsMap = new Map();
        this.apiService.loadTransactions(year, month)
            .subscribe(transactions => {
            transactions.forEach(transactionAux => {
                switch (transactionAux.typeTransaction) {
                    case TransactionTypes.SPENDING:
                        if (loadExpenses)
                            this.agregateTransactionAmount(transactionsMap, transactionAux);
                        break;
                    default:
                        if (!loadExpenses)
                            this.agregateTransactionAmount(transactionsMap, transactionAux);
                        break;
                }
            });
            this.updateSpendingChart(transactionsMap);
        });
    }
    updateSpendingChart(spendingsTransactions) {
        var _a;
        this.pieChartData.labels = [];
        this.pieChartData.datasets[0].data = [];
        spendingsTransactions.forEach((value, key) => {
            var _a;
            (_a = this.pieChartData.labels) === null || _a === void 0 ? void 0 : _a.push(key);
            this.pieChartData.datasets[0].data.push(value);
        });
        (_a = this.chartExpenses) === null || _a === void 0 ? void 0 : _a.update();
    }
    agregateTransactionAmount(transactinonsMap, transaction) {
        var _a;
        var trCode = transaction.codeTransaction;
        if (transactinonsMap.has(trCode)) {
            var totalAmount = ((_a = transactinonsMap === null || transactinonsMap === void 0 ? void 0 : transactinonsMap.get(trCode)) !== null && _a !== void 0 ? _a : 0) + transaction.amount;
            totalAmount = Math.round(totalAmount * 100) / 100;
            transactinonsMap.set(trCode, totalAmount);
        }
        else {
            transactinonsMap.set(trCode, transaction.amount);
        }
    }
};
__decorate([
    ViewChild(BaseChartDirective)
], ResumeMonthTransaction.prototype, "chartExpenses", void 0);
ResumeMonthTransaction = __decorate([
    Component({
        selector: "resumeMonthTransaction",
        templateUrl: "resumeMonthTransaction.component.html"
    })
], ResumeMonthTransaction);
export { ResumeMonthTransaction };
//# sourceMappingURL=resumeMonthTransaction.component.js.map