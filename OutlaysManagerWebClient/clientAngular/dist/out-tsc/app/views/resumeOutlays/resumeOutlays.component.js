import { __decorate } from "tslib";
import { Component } from "@angular/core";
import { Type } from "../../model/TransactionDTO";
let ResumeOutlays = class ResumeOutlays {
    constructor(calendarService, apiService) {
        this.calendarService = calendarService;
        this.apiService = apiService;
        this.incomingView = "0";
        this.expensesView = "0";
        this.savingView = "0";
        this.totalAmountView = "0";
        this.DEC_NUMBER = 2;
        this.calendarService.matrixCalendarSubject.subscribe((transactionCalendarMatrix) => {
            this.loadResume(transactionCalendarMatrix);
        });
    }
    ngOnInit() {
        this.loadTotalAmount();
    }
    loadResume(transactionCalendarMatrix) {
        var incoming = 0;
        var expenses = 0;
        var saving = 0;
        for (let week of transactionCalendarMatrix) {
            for (let transactionsDay of week) {
                for (let transactionAux of transactionsDay.transactionArray) {
                    switch (transactionAux.detailTransaction.type) {
                        case Type.Incoming:
                            incoming += transactionAux.amount;
                            break;
                        case Type.Adjust:
                            incoming += transactionAux.amount;
                            break;
                        case Type.Spending:
                            expenses += transactionAux.amount;
                            break;
                    }
                }
            }
        }
        saving = incoming - expenses;
        this.incomingView = Math.round(incoming).toFixed(this.DEC_NUMBER);
        this.expensesView = Math.round(expenses).toFixed(this.DEC_NUMBER);
        this.savingView = Math.round(saving).toFixed(this.DEC_NUMBER);
        this.loadTotalAmount();
    }
    loadTotalAmount() {
        var totalAmount = 0;
        this.apiService.loadAllTransactions().subscribe(values => {
            values.forEach(transactionAux => {
                switch (transactionAux.detailTransaction.type) {
                    case Type.Incoming:
                        totalAmount += transactionAux.amount;
                        break;
                    case Type.Adjust:
                        totalAmount += transactionAux.amount;
                        break;
                    case Type.Spending:
                        totalAmount -= transactionAux.amount;
                        break;
                }
            });
            this.totalAmountView = Math.round(totalAmount).toFixed(this.DEC_NUMBER);
        });
    }
};
ResumeOutlays = __decorate([
    Component({
        selector: "resumeOutlays",
        templateUrl: "resumeOutlays.component.html"
    })
], ResumeOutlays);
export { ResumeOutlays };
//# sourceMappingURL=resumeOutlays.component.js.map