import { __decorate } from "tslib";
import { Component } from "@angular/core";
import { MessageView, VerboseType } from "../../model/MessageView";
let DateSelector = class DateSelector {
    constructor(calendarService, outlayManagerAPI, mainApp) {
        this.calendarService = calendarService;
        this.outlayManagerAPI = outlayManagerAPI;
        this.mainApp = mainApp;
        this.monthsNamesMap = new Map([
            ["Enero", 1],
            ["Febrero", 2],
            ["Marzo", 3],
            ["Abril", 4],
            ["Mayo", 5],
            ["Junio", 6],
            ["Julio", 7],
            ["Agosto", 8],
            ["Septiembre", 9],
            ["Octubre", 10],
            ["Noviembre", 11],
            ["Diciembre", 12],
        ]);
        this.yearsAvailables = new Array();
        this.yearView = "";
        this.monthView = "";
    }
    ngOnInit() {
        this.outlayManagerAPI.loadYearsAvailabes()
            .subscribe(response => {
            this.yearsAvailables = response;
            this.loadCurrentDateToView();
        }, error => {
            this.mainApp.openModalMessage(this.buildMessageErrorFromAPIError(error, "Load Years Availables"));
        });
    }
    updateCalendar() {
        try {
            var yearNormalized = parseInt(this.yearView);
            var monthNormalized = this.monthsNamesMap.get(this.monthView);
            if (!(yearNormalized > 1900 && (monthNormalized >= 1 && monthNormalized <= 12))) {
                throw Error("Date selected is not valid! Year: " + yearNormalized + " Month: " + monthNormalized);
            }
            this.calendarService.loadTransactionsCalendar(yearNormalized, monthNormalized);
        }
        catch (exception) {
            var messageView = new MessageView();
            messageView.action = "Calendar Builder";
            messageView.titleError = exception.toString();
            messageView.verbose = VerboseType.Error;
            this.mainApp.openModalMessage(messageView);
        }
    }
    buildMessageErrorFromAPIError(error, action) {
        var messageView = new MessageView();
        messageView.action = action;
        messageView.titleError = error.Message;
        messageView.detail = "";
        messageView.statusCode = error.StatusCode;
        messageView.verbose = VerboseType.Error;
        return messageView;
    }
    loadCurrentDateToView() {
        var today = new Date(Date.now());
        var currentYear = today.getFullYear();
        if (!this.yearsAvailables.find(value => value === currentYear)) {
            this.yearsAvailables.push(currentYear);
        }
        this.yearView = currentYear.toString();
        var currentMonth = today.getMonth() + 1;
        this.monthsNamesMap.forEach((value, key) => {
            if (value === currentMonth) {
                this.monthView = key;
            }
        });
    }
};
DateSelector = __decorate([
    Component({
        selector: "date-selector",
        templateUrl: "dateSelector.component.html"
    })
], DateSelector);
export { DateSelector };
//# sourceMappingURL=dateSelector.component.js.map