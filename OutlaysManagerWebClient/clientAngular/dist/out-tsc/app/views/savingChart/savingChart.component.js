import { __decorate } from "tslib";
import { Component, ViewChild } from "@angular/core";
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from "ng2-charts";
import { MessageView, VerboseType } from "../../model/MessageView";
import { TransactionTypes } from "../../model/TransactionTypes";
import { ResumeMonthTransactions } from "../resumeMonthTransactions/resumeMonthTransactions.component";
let SavingChart = class SavingChart {
    constructor(outlayAPIService, mainApp, calendarService, angularZone) {
        this.outlayAPIService = outlayAPIService;
        this.mainApp = mainApp;
        this.calendarService = calendarService;
        this.angularZone = angularZone;
        this.monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        this.yearSelected = 0;
        this.yearsAvailables = new Array();
        this.barChartOptions = {
            responsive: true,
            // We use these empty structures as placeholders for dynamic theming.
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                },
                datalabels: {
                    anchor: 'end',
                    align: 'end'
                }
            },
            //onClick: (clickEvt, ActiveElements) => this.onChartClick(clickEvt, ActiveElements)
        };
        this.barChartType = 'bar';
        this.barChartPlugins = [
            DataLabelsPlugin
        ];
        this.barChartData = {
            labels: this.monthNames,
            datasets: []
        };
        this.calendarService.calendarContainerSubject.subscribe(response => { this.updateResumeMonthTransactions(response); });
    }
    ngOnInit() {
        this.outlayAPIService.loadYearsAvailabes()
            .subscribe(response => {
            this.yearsAvailables = response;
        }, error => {
            this.mainApp.openModalMessage(this.buildMessageError(error, "Load Years Availables"));
        });
    }
    updateTransactionsResume(response) {
        if (response.active.length === 1) {
            var indexDataSet = response.active[0].datasetIndex;
            var year = this.barChartData.datasets[indexDataSet].label;
            var month = response.active[0].index;
            var yearParsed = Number.parseInt(year !== null && year !== void 0 ? year : "0");
            var monthParsed = month + 1;
            //Como el tema del grafico va por fuera de angular, los cambios no los pilla el componente
            //Para que lo haga te tienes que meter en el hilo de ejecuion de angular desde el chart-event
            this.angularZone.run(() => { this.calendarService.loadTransactionsCalendar(yearParsed, monthParsed); });
        }
    }
    updateResumeMonthTransactions(calendarContainer) {
        var _a;
        (_a = this.resumeMonthComponent) === null || _a === void 0 ? void 0 : _a.loadResumeTransactions(calendarContainer);
    }
    clearChart() {
        var _a;
        this.barChartData.datasets = [];
        (_a = this.chart) === null || _a === void 0 ? void 0 : _a.update();
    }
    addYearOutlaysSavings() {
        this.outlayAPIService.loadTransactionsYear(this.yearSelected).subscribe(response => {
            var _a;
            var dataMap = new Map();
            var allTransactions = allTransactions = response;
            allTransactions.forEach(value => {
                var _a;
                var key = this.generateDateKey(value);
                var amount = this.getAmountSaved(value);
                if (dataMap.has(key)) {
                    var totalAmount = (_a = dataMap.get(key)) !== null && _a !== void 0 ? _a : 0;
                    totalAmount += amount;
                    totalAmount = Math.round(totalAmount * 100) / 100;
                    dataMap.set(key, totalAmount);
                }
                else {
                    dataMap.set(key, amount);
                }
            });
            var values = new Array();
            this.monthNames.forEach(x => {
                var _a;
                if (dataMap.has(x)) {
                    values.push((_a = dataMap.get(x)) !== null && _a !== void 0 ? _a : 0);
                }
                else {
                    values.push(0);
                }
            });
            this.barChartData.datasets.push({ data: values, label: this.yearSelected.toString() });
            (_a = this.chart) === null || _a === void 0 ? void 0 : _a.update();
        });
    }
    generateDateKey(transactionDTO) {
        var date = new Date(transactionDTO.date);
        var month = this.monthNames[date.getMonth()];
        return month;
    }
    getAmountSaved(transactionDTO) {
        var saving = 0;
        if (transactionDTO.typeTransaction == TransactionTypes.SPENDING) {
            saving = transactionDTO.amount * -1;
        }
        else {
            saving = transactionDTO.amount;
        }
        return saving;
    }
    buildMessageError(error, action) {
        var messageView = new MessageView();
        messageView.action = action;
        messageView.titleError = error.Message;
        messageView.detail = "";
        messageView.statusCode = error.StatusCode;
        messageView.verbose = VerboseType.Error;
        return messageView;
    }
};
__decorate([
    ViewChild(BaseChartDirective)
], SavingChart.prototype, "chart", void 0);
__decorate([
    ViewChild(ResumeMonthTransactions)
], SavingChart.prototype, "resumeMonthComponent", void 0);
SavingChart = __decorate([
    Component({
        selector: "savingChart",
        templateUrl: "savingChart.component.html"
    })
], SavingChart);
export { SavingChart };
//# sourceMappingURL=savingChart.component.js.map