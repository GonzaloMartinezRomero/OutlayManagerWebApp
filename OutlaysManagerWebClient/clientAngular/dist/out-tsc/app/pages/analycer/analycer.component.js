import { __decorate } from "tslib";
import { Component, ViewChild } from "@angular/core";
import { BaseChartDirective } from "ng2-charts";
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
let Analycer = class Analycer {
    constructor() {
        this.barChartOptions = {
            responsive: true,
            // We use these empty structures as placeholders for dynamic theming.
            scales: {
                x: {},
                y: {
                    min: 10
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
            }
        };
        this.barChartType = 'bar';
        this.barChartPlugins = [
            DataLabelsPlugin
        ];
        this.barChartData = {
            labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
            datasets: [
                { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
                { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
            ]
        };
    }
    // events
    chartClicked({ event, active }) {
        console.log(event, active);
    }
    chartHovered({ event, active }) {
        console.log(event, active);
    }
    randomize() {
        var _a;
        // Only Change 3 values
        this.barChartData.datasets[0].data = [
            Math.round(Math.random() * 100),
            59,
            80,
            Math.round(Math.random() * 100),
            56,
            Math.round(Math.random() * 100),
            40
        ];
        (_a = this.chart) === null || _a === void 0 ? void 0 : _a.update();
    }
};
__decorate([
    ViewChild(BaseChartDirective)
], Analycer.prototype, "chart", void 0);
Analycer = __decorate([
    Component({
        selector: "analycer",
        templateUrl: "analycer.component.html"
    })
], Analycer);
export { Analycer };
//# sourceMappingURL=analycer.component.js.map