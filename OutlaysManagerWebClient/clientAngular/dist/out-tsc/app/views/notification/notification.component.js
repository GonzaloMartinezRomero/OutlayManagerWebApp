import { __decorate } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { MessageView, VerboseType } from '../../model/MessageView';
let NotificationEvent = class NotificationEvent {
    constructor(ngbModal) {
        this.ngbModal = ngbModal;
        this.modalRefActive = undefined;
        this.queueMessages = new Array();
        this.loadingMessage = "";
        this.isModalLoadingMode = true;
        this.messageView = new MessageView();
        this.informationType = VerboseType.Information;
        this.errorType = VerboseType.Error;
    }
    showLoading(message) {
        this.loadingMessage = message;
        this.isModalLoadingMode = true;
        this.loadingModal = this.ngbModal.open(this.loadingTemplateRef, {
            centered: true, backdrop: 'static', keyboard: false
        });
    }
    finalizeLoading(message) {
        this.loadingMessage = message;
        this.isModalLoadingMode = false;
    }
    closeLoadingModal() {
        var _a;
        (_a = this.loadingModal) === null || _a === void 0 ? void 0 : _a.close();
    }
    openModalMessage(message) {
        if (this.modalRefActive === undefined) {
            this.messageView = message;
            this.modalRefActive = this.ngbModal.open(this.notificationModalRef, { centered: true, backdrop: 'static', keyboard: false });
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
    ViewChild('loadingModal')
], NotificationEvent.prototype, "loadingTemplateRef", void 0);
__decorate([
    ViewChild('notificationModal')
], NotificationEvent.prototype, "notificationModalRef", void 0);
NotificationEvent = __decorate([
    Component({
        selector: 'notification-event',
        templateUrl: "notification.component.html",
        styleUrls: ['notification.component.scss']
    })
], NotificationEvent);
export { NotificationEvent };
//# sourceMappingURL=notification.component.js.map