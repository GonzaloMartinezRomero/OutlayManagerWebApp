import { __decorate } from "tslib";
import { Component, ViewChild } from "@angular/core";
let Loading = class Loading {
    constructor(modalABM) {
        this.modalABM = modalABM;
        this.loadingMessage = "";
    }
    showLoading(message) {
        this.loadingMessage = message;
        console.log("Entre en el loading");
        console.log(this.loadingModalComponent);
        this.modalABM.open(this.loadingModalComponent, { centered: true, backdrop: 'static', keyboard: false });
        console.log(this.modalABM.activeInstances);
    }
    hideLoading() {
        var _a;
        (_a = this.loadingModal) === null || _a === void 0 ? void 0 : _a.close();
    }
};
__decorate([
    ViewChild('loadingComponent')
], Loading.prototype, "loadingModalComponent", void 0);
Loading = __decorate([
    Component({
        selector: "loading",
        templateUrl: "loading.component.html",
        styleUrls: ['StyleSheet.scss']
    })
], Loading);
export { Loading };
//# sourceMappingURL=loading.component.js.map