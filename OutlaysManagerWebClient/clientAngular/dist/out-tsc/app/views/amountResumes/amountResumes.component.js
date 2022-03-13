import { __decorate } from "tslib";
import { Component, ViewChild } from "@angular/core";
import { BaseChartDirective } from "ng2-charts";
let AmountResumes = class AmountResumes {
    constructor(outlayAPIService) {
        this.outlayAPIService = outlayAPIService;
        this.lineChartType = 'line';
        this.resumeAmountArray = new Array();
        this.lineChartOptions = {
            responsive: true,
            // We use these empty structures as placeholders for dynamic theming.
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
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
        };
        this.dateLabels = new Array();
        this.amountDataSet = new Array();
        this.lineChartData = {
            datasets: [
                {
                    data: this.amountDataSet,
                    label: "Total Amount",
                    backgroundColor: 'rgba(148,159,177,0.2)',
                    borderColor: 'rgba(148,159,177,1)',
                    pointBackgroundColor: 'rgba(148,159,177,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(148,159,177,0.8)',
                }
            ],
            labels: this.dateLabels
        };
    }
    ngOnInit() {
        this.outlayAPIService.loadAmountResumes()
            .subscribe(values => {
            var _a;
            this.resumeAmountArray = values;
            this.resumeAmountArray.forEach(value => {
                this.dateLabels.push(this.buildKeyLabel(value));
                this.amountDataSet.push(value.amount);
            });
            (_a = this.chart) === null || _a === void 0 ? void 0 : _a.update();
        });
    }
    buildKeyLabel(amountResume) {
        var year = amountResume.year.toString();
        var month = amountResume.month.toString();
        return year + "_" + month;
    }
};
__decorate([
    ViewChild(BaseChartDirective)
], AmountResumes.prototype, "chart", void 0);
AmountResumes = __decorate([
    Component({
        selector: "amountResumes",
        templateUrl: "amountResumes.component.html"
    })
], AmountResumes);
export { AmountResumes };
//# sourceMappingURL=amountResumes.component.js.map