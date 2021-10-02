import { __decorate } from "tslib";
import { Injectable } from "@angular/core";
import { TransacionCalendar, TransactionsCalendarContainer } from "../model/TransactionsCalendarContainer";
let CalendarService = class CalendarService {
    constructor(outlayManagerAPI) {
        this.outlayManagerAPI = outlayManagerAPI;
        this.weekDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
        this.transactionsCalendar = new TransactionsCalendarContainer();
    }
    loadTransactionsCalendar(year, month) {
        this.outlayManagerAPI.loadTransactions(year, month)
            .subscribe(response => {
            var transactionsMap = new Map();
            response.forEach(transactionAux => {
                var _a;
                var day = new Date(transactionAux.date).getDate();
                if (transactionsMap.has(day)) {
                    (_a = transactionsMap.get(day)) === null || _a === void 0 ? void 0 : _a.push(transactionAux);
                }
                else {
                    var array = new Array();
                    array.push(transactionAux);
                    transactionsMap.set(day, array);
                }
            });
            this.loadCompleteCalendar(year, month, transactionsMap);
        });
    }
    loadCompleteCalendar(year, month, transactionsMap) {
        var _a, _b;
        //Initialize new values
        this.transactionsCalendar.year = year;
        this.transactionsCalendar.month = month;
        this.transactionsCalendar.matrixCalendar = new Array();
        //Set week days
        this.transactionsCalendar.weekDays = this.weekDays;
        var dayNumber = 1;
        var daysInMonth = new Date(year, month, 0).getDate();
        var strDate = year.toString() + "/" + month.toString() + "/01";
        var initialDay = (new Date(strDate).getDay() - 1) % 7;
        var firstWeekComplete = false;
        while (dayNumber <= daysInMonth) {
            if (!firstWeekComplete) {
                var firstWeek = new Array();
                for (let i = 0; i < this.weekDays.length; i++) {
                    if (i < initialDay) {
                        let transactionEmpty = new TransacionCalendar();
                        transactionEmpty.isTransactionAvailable = false;
                        firstWeek.push(transactionEmpty);
                    }
                    else {
                        let transactionAvailable = new TransacionCalendar();
                        transactionAvailable.day = dayNumber;
                        if (transactionsMap.has(dayNumber)) {
                            transactionAvailable.transactionArray = (_a = transactionsMap.get(dayNumber)) !== null && _a !== void 0 ? _a : new Array();
                        }
                        transactionAvailable.isToday = this.isToday(year, month, dayNumber);
                        firstWeek.push(transactionAvailable);
                        dayNumber++;
                    }
                }
                this.transactionsCalendar.matrixCalendar.push(firstWeek);
                firstWeekComplete = true;
            }
            else {
                var dayNumberIndexAux = 0;
                var weekAux = new Array();
                while (dayNumberIndexAux < this.weekDays.length) {
                    if (dayNumber > daysInMonth) {
                        let transactionEmpty = new TransacionCalendar();
                        transactionEmpty.isTransactionAvailable = false;
                        weekAux.push(transactionEmpty);
                    }
                    else {
                        let transactionAvailable = new TransacionCalendar();
                        transactionAvailable.day = dayNumber;
                        if (transactionsMap.has(dayNumber)) {
                            transactionAvailable.transactionArray = (_b = transactionsMap.get(dayNumber)) !== null && _b !== void 0 ? _b : new Array();
                        }
                        transactionAvailable.isToday = this.isToday(year, month, dayNumber);
                        weekAux.push(transactionAvailable);
                        dayNumber++;
                    }
                    dayNumberIndexAux++;
                }
                this.transactionsCalendar.matrixCalendar.push(weekAux);
            }
        }
    }
    isToday(year, month, dayNumber) {
        var today = new Date(Date.now());
        return today.getFullYear() === year && today.getMonth() === (month - 1) && today.getDate() === dayNumber;
    }
};
CalendarService = __decorate([
    Injectable()
], CalendarService);
export { CalendarService };
//# sourceMappingURL=calendar.service.js.map