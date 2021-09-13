import { __decorate } from "tslib";
import { Component } from "@angular/core";
let DateSelector = class DateSelector {
    constructor() {
        var currentTime = new Date();
        this.year = currentTime.getFullYear();
        this.month = currentTime.getMonth();
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