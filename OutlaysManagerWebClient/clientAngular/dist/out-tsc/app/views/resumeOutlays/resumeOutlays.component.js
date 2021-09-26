import { __decorate } from "tslib";
import { Component } from "@angular/core";
import { Type } from "../../model/TransactionDTO";
let ResumeOutlays = class ResumeOutlays {
    constructor(calendarService) {
        this.calendarService = calendarService;
        this.incoming = 0;
        this.expenses = 0;
        this.saving = 0;
        this.calendarService.matrixCalendarSubject.subscribe((transactionCalendarMatrix) => {
            this.loadResume(transactionCalendarMatrix);
        });
    }
    loadResume(transactionCalendarMatrix) {
        this.incoming = 0;
        this.expenses = 0;
        this.saving = 0;
        for (let week of transactionCalendarMatrix) {
            for (let transactionsDay of week) {
                for (let transactionAux of transactionsDay.transactionArray) {
                    switch (transactionAux.detailTransaction.type) {
                        case Type.Incoming:
                            this.incoming += transactionAux.amount;
                            break;
                        case Type.Adjust:
                            this.incoming += transactionAux.amount;
                            break;
                        case Type.Spending:
                            this.expenses += transactionAux.amount;
                            break;
                    }
                }
            }
        }
        this.saving = this.incoming - this.expenses;
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