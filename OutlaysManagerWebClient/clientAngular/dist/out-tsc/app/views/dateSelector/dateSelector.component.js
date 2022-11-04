import { __decorate } from "tslib";
import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { DateCalendar } from "../../model/DateCalendar";
import { MessageView, VerboseType } from "../../model/MessageView";
import { ExceptionUtils } from "../../utils/exceptionUtils";
let DateSelector = class DateSelector {
    constructor(outlayManagerAPI) {
        this.outlayManagerAPI = outlayManagerAPI;
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
        this.monthsNamesReverseMap = new Map([
            [1, "January"],
            [2, "Febrary"],
            [3, "March"],
            [4, "April"],
            [5, "May"],
            [6, "Juny"],
            [7, "July"],
            [8, "Agost"],
            [9, "September"],
            [10, "October"],
            [11, "November"],
            [12, "December"],
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
            var _a;
            (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
        });
    }
    updateCalendar() {
        var _a;
        try {
            var calendarDate = this.getCalendarDate();
            this.updateDateCalendarEmitter.emit(calendarDate);
        }
        catch (exception) {
            var messageView = new MessageView();
            messageView.action = "Calendar Builder";
            messageView.titleError = exception.toString();
            messageView.verbose = VerboseType.Error;
            (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.openModalMessage(messageView);
        }
    }
    nextMonth() {
        var calendarDate = this.getCalendarDate();
        if (calendarDate.Month === 12) {
            calendarDate.Month = 1;
            calendarDate.Year += 1;
        }
        else {
            calendarDate.Month += 1;
        }
        this.updateCalendarViewValues(calendarDate);
    }
    backMonth() {
        var calendarDate = this.getCalendarDate();
        if (calendarDate.Month === 1) {
            calendarDate.Month = 12;
            calendarDate.Year -= 1;
        }
        else {
            calendarDate.Month -= 1;
        }
        this.updateCalendarViewValues(calendarDate);
    }
    updateCalendarViewValues(calendarDate) {
        var _a;
        if (this.yearsAvailables.find(value => value === calendarDate.Year)) {
            this.yearView = calendarDate.Year.toString();
            this.monthView = (_a = this.monthsNamesReverseMap.get(calendarDate.Month)) !== null && _a !== void 0 ? _a : "";
            this.updateDateCalendarEmitter.emit(calendarDate);
        }
    }
    getCalendarDate() {
        var yearNormalized = parseInt(this.yearView);
        var monthNormalized = this.monthsNamesMap.get(this.monthView);
        if (!(yearNormalized > 1900 && (monthNormalized >= 1 && monthNormalized <= 12))) {
            throw Error("Date selected is not valid! Year: " + yearNormalized + " Month: " + monthNormalized);
        }
        var calendarDate = new DateCalendar();
        calendarDate.Year = yearNormalized;
        calendarDate.Month = monthNormalized;
        return calendarDate;
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
    ViewChild("notificationComponent")
], DateSelector.prototype, "notificationComponent", void 0);
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