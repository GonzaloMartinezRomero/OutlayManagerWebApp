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
        this.PATH_ARROW_UP = "clientAngular/assets/img/arrowUp.svg";
        this.PATH_ARROW_DOWN = "clientAngular/assets/img/arrowDown.svg";
        this.calendarService.matrixCalendarSubject.subscribe((transactionCalendarMatrix) => {
            this.loadResume(transactionCalendarMatrix);
            this.loadTotalAmount();
        });
    }
    ngOnInit() {
        this.loadTotalAmount();
    }
    loadResume(transactionCalendarMatrix) {
        var incoming = 0.0;
        var expenses = 0.0;
        var saving = 0.0;
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
        this.incomingView = this.toEuroString(incoming);
        this.expensesView = this.toEuroString(expenses);
        this.savingView = this.toEuroString(saving);
    }
    isGreaterThanZero(amount) {
        var valueCero = 0.0;
        var value = Number(amount);
        console.log(value);
        console.log(value > valueCero);
        return value > valueCero;
    }
    loadTotalAmount() {
        var totalAmount = 0.0;
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