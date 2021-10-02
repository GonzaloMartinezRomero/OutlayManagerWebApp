import { __decorate } from "tslib";
import { ViewChild } from '@angular/core';
import { Component, Injectable } from '@angular/core';
import { MessageView, VerboseType } from './model/MessageView';
let AppComponent = class AppComponent {
    constructor(ngbModal) {
        this.ngbModal = ngbModal;
        this.title = 'Outlay Manager Web APP';
        this.messageView = new MessageView();
        this.informationType = VerboseType.Information;
        this.errorType = VerboseType.Error;
        this.modalRefActive = undefined;
        this.queueMessages = new Array();
    }
    openModalMessage(message) {
        if (this.modalRefActive === undefined) {
            this.messageView = message;
            this.modalRefActive = this.ngbModal.open(this.modalContent, { centered: true, backdrop: 'static', keyboard: false });
        }
        else {
            this.queueMessages.push(message);
        }
    }
    closeModalMessage() {
        var _a, _b;
        if (this.queueMessages.length > 0) {
            this.messageView = (_a = this.queueMessages.pop()) !== null && _a !== void 0 ? _a : new MessageView();
        }
        else {
            (_b = this.modalRefActive) === null || _b === void 0 ? void 0 : _b.close();
            this.modalRefActive = undefined;
        }
    }
};
__decorate([
    ViewChild('modalMessage')
], AppComponent.prototype, "modalContent", void 0);
AppComponent = __decorate([
    Component({
        selector: 'OutlayManagerMainPage',
        templateUrl: "app.component.html",
        styles: []
    }),
    Injectable()
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map