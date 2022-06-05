import { __decorate } from "tslib";
import { Component, ViewChild } from "@angular/core";
import { ExceptionUtils } from "../../utils/exceptionUtils";
let Dashboard = class Dashboard {
    constructor(outlayManagerApiService) {
        this.outlayManagerApiService = outlayManagerApiService;
    }
    downloadRemoteTransactions() {
        var _a;
        (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.showLoading("Sync transactions...");
        this.outlayManagerApiService.downloadRemoteTransaction()
            .subscribe(result => {
            var _a, _b;
            (_a = this.calendarComponent) === null || _a === void 0 ? void 0 : _a.updateCalendarDate(null);
            var numberOfTransactions = result.length;
            (_b = this.notificationComponent) === null || _b === void 0 ? void 0 : _b.finalizeLoading("Added " + numberOfTransactions + " transactions!");
        }, error => {
            var _a, _b;
            (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.finalizeLoading("Error during transaction sync");
            (_b = this.notificationComponent) === null || _b === void 0 ? void 0 : _b.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
        });
    }
};
__decorate([
    ViewChild("calendar")
], Dashboard.prototype, "calendarComponent", void 0);
__decorate([
    ViewChild("notificationComponent")
], Dashboard.prototype, "notificationComponent", void 0);
Dashboard = __decorate([
    Component({
        selector: "dashboard",
        templateUrl: "dashboard.component.html"
    })
], Dashboard);
export { Dashboard };
//# sourceMappingURL=dashboard.component.js.map