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
        var today = new Date();
        this.year = today.getFullYear().toString();
        this.month = today.getMonth().toString();
    }
    ngOnInit() {
        this.outlayManagerAPI.loadYearsAvailabes()
            .subscribe(response => {
            this.yearsAvailables = response;
            //Cargar el año siguiente al ultimo año
            this.yearsAvailables.push(this.yearsAvailables[this.yearsAvailables.length - 1] + 1);
        }, error => { this.mainApp.openModalMessage(this.buildMessageErrorFromAPIError(error, "Load Years Availables")); });
        this.updateCalendar();
    }
    updateCalendar() {
        const yearNormalized = parseInt(this.year);
        const monthNormalized = this.monthsNamesMap.get(this.month);
        try {
            this.calendarService.loadTransactionsCalendar(yearNormalized, monthNormalized);
        }
        catch (exception) {
            var messageView = new MessageView();
            messageView.action = "Calendar Builder";
            messageView.titleError = exception.toString();
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
};
DateSelector = __decorate([
    Component({
        selector: "date-selector",
        templateUrl: "dateSelector.component.html"
    })
], DateSelector);
export { DateSelector };
//# sourceMappingURL=dateSelector.component.js.map