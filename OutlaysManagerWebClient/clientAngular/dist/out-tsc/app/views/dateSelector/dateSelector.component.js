import { __decorate } from "tslib";
import { Component, EventEmitter, Output } from "@angular/core";
import { DateCalendar } from "../../model/DateCalendar";
import { MessageView, VerboseType } from "../../model/MessageView";
import { ExceptionUtils } from "../../utils/exceptionUtils";
let DateSelector = class DateSelector {
    constructor(outlayManagerAPI, mainApp) {
        this.outlayManagerAPI = outlayManagerAPI;
        this.mainApp = mainApp;
        this.updateDateCalendarEmitter = new EventEmitter();
        this.monthsNamesMap = new Map([
            ["January", 1],
            ["Febrary", 2],
            ["March", 3],
            ["April", 4],
            ["May", 5],
            ["Juny", 6],
            ["July", 7],
            ["Agost", 8],
            ["September", 9],
            ["October", 10],
            ["November", 11],
            ["December", 12],
        ]);
        this.yearsAvailables = new Array();
        this.yearView = "";
        this.monthView = "";
    }
    ngAfterViewInit() {
        this.outlayManagerAPI.loadYearsAvailabes()
            .subscribe(response => {
            this.yearsAvailables = response;
            this.loadCurrentDateToView();
            this.updateCalendar();
        }, error => {
            this.mainApp.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
        });
    }
    updateCalendar() {
        try {
            var yearNormalized = parseInt(this.yearView);
            var monthNormalized = this.monthsNamesMap.get(this.monthView);
            if (!(yearNormalized > 1900 && (monthNormalized >= 1 && monthNormalized <= 12))) {
                throw Error("Date selected is not valid! Year: " + yearNormalized + " Month: " + monthNormalized);
            }
            var calendarDate = new DateCalendar();
            calendarDate.Year = yearNormalized;
            calendarDate.Month = monthNormalized;
            this.updateDateCalendarEmitter.emit(calendarDate);
        }
        catch (exception) {
            var messageView = new MessageView();
            messageView.action = "Calendar Builder";
            messageView.titleError = exception.toString();
            messageView.verbose = VerboseType.Error;
            this.mainApp.openModalMessage(messageView);
        }
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
__decorate([
    Output()
], DateSelector.prototype, "updateDateCalendarEmitter", void 0);
DateSelector = __decorate([
    Component({
        selector: "date-selector",
        templateUrl: "dateSelector.component.html"
    })
], DateSelector);
export { DateSelector };
//# sourceMappingURL=dateSelector.component.js.map