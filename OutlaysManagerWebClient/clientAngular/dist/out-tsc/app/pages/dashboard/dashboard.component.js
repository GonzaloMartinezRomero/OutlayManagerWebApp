import { __decorate } from "tslib";
import { Component, ViewChild } from "@angular/core";
import { ExceptionUtils } from "../../utils/exceptionUtils";
let Dashboard = class Dashboard {
    constructor(outlayManagerApiService) {
        this.outlayManagerApiService = outlayManagerApiService;
    }
    synchronizeRemoteTransactions() {
        var _a;
        (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.showLoading("Sync transactions...");
        this.outlayManagerApiService.synchronizeRemoteTransaction()
            .subscribe(result => {
            var _a, _b, _c;
            var numberOfTransactions = result.length;
            if (numberOfTransactions == 0) {
                (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.finalizeLoading("No transactions for sync");
            }
            else {
                (_b = this.calendarComponent) === null || _b === void 0 ? void 0 : _b.updateCalendarDate(null);
                (_c = this.notificationComponent) === null || _c === void 0 ? void 0 : _c.finalizeLoading(`Added ${numberOfTransactions} transactions`);
            }
        }, error => {
            var _a, _b;
            console.log(error);
            (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.closeLoadingModal();
            (_b = this.notificationComponent) === null || _b === void 0 ? void 0 : _b.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
        });
    }
    backupTransactions() {
        var _a;
        (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.showLoading("Backup transactions...");
        this.outlayManagerApiService.backupTransactions()
            .subscribe(result => {
            var _a;
            (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.finalizeLoading("Backup successfully!");
        }, error => {
            var _a, _b;
            (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.closeLoadingModal();
            (_b = this.notificationComponent) === null || _b === void 0 ? void 0 : _b.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
        });
    }
    downloadBackup() {
        this.outlayManagerApiService.downloadBackupFileTransactions()
            .subscribe(result => {
            let downloadLink = document.createElement('a');
            downloadLink.download = "TransactionBackup";
            let binaryData = [];
            binaryData.push(result);
            let blob = new Blob(binaryData, { type: "application/json" });
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.click();
        }, error => {
            var _a;
            (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
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