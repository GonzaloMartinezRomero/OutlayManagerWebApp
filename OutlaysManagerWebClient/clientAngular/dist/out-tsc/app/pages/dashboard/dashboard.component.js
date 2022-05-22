import { __decorate } from "tslib";
import { Component } from "@angular/core";
import { MessageView } from "../../model/MessageView";
let Dashboard = class Dashboard {
    constructor(outlayManagerApiService, mainApp) {
        this.outlayManagerApiService = outlayManagerApiService;
        this.mainApp = mainApp;
    }
    downloadRemoteTransactions() {
        this.outlayManagerApiService.downloadRemoteTransaction().subscribe(result => {
            var messageView = new MessageView();
            messageView.detail = "Added " + result.length + " transactions";
            this.mainApp.openModalMessage(messageView);
        });
    }
};
Dashboard = __decorate([
    Component({
        selector: "dashboard",
        templateUrl: "dashboard.component.html"
    })
], Dashboard);
export { Dashboard };
//# sourceMappingURL=dashboard.component.js.map