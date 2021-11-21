import { __decorate } from "tslib";
import { Component } from "@angular/core";
import { TransactionTypes } from "../../model/TransactionTypes";
let ResumeOutlays = class ResumeOutlays {
    constructor(calendarService, apiService) {
        this.calendarService = calendarService;
        this.apiService = apiService;
        this.incomingView = "0";
        this.expensesView = "0";
        this.savingView = "0";
        this.totalAmountView = "0";
        this.IMG_ARROW_UP = "arrowUp.svg";
        this.IMG_ARROW_DOWN = "arrowDown.svg";
        this.calendarService.matrixCalendarSubject.subscribe((transactionCalendarMatrix) => {
            this.loadMonthResume(transactionCalendarMatrix);
            this.loadTotalAmount();
        });
    }
    ngOnInit() {
        this.loadTotalAmount();
    }
    loadMonthResume(transactionCalendarMatrix) {
        var incoming = 0.0;
        var expenses = 0.0;
        var saving = 0.0;
        for (let week of transactionCalendarMatrix) {
            for (let transactionsDay of week) {
                for (let transactionAux of transactionsDay.transactionArray) {
                    switch (transactionAux.typeTransaction) {
                        case TransactionTypes.INCOMING:
                            incoming += transactionAux.amount;
                            break;
                        case TransactionTypes.ADJUST:
                            incoming += transactionAux.amount;
                            break;
                        case TransactionTypes.SPENDING:
                            expenses += transactionAux.amount;
                            break;
                    }
                }
            }
        }
        saving = incoming - expenses;
        this.incomingView = this.toEuroString(incoming);
        this.expensesView = this.toEuroString(expenses);
        this.savingView = this.toEuroString(saving);
    }
    isGreaterThanZero(amount) {
        var valueCero = 0.0;
        var value = parseFloat(amount);
        return value > valueCero;
    }
    loadTotalAmount() {
        var totalAmount = 0.0;
        this.apiService.loadAllTransactions().subscribe(values => {
            values.forEach(transactionAux => {
                switch (transactionAux.typeTransaction) {
                    case TransactionTypes.INCOMING:
                        totalAmount += transactionAux.amount;
                        break;
                    case TransactionTypes.ADJUST:
                        totalAmount += transactionAux.amount;
                        break;
                    case TransactionTypes.SPENDING:
                        totalAmount -= transactionAux.amount;
                        break;
                }
            });
            this.totalAmountView = this.toEuroString(totalAmount);
        });
    }
    toEuroString(amount) {
        var amountRounded = Math.round(amount * 100) / 100;
        var amountParsed = amountRounded.toLocaleString("de-DE");
        return amountParsed;
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