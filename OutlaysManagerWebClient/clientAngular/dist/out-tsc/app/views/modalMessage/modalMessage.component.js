import { __decorate } from "tslib";
import { Component, Injectable, ViewChild } from "@angular/core";
import { MessageView, VerboseType } from "../../model/MessageView";
let ModalMessage = class ModalMessage {
    constructor(ngbModal) {
        this.ngbModal = ngbModal;
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
], ModalMessage.prototype, "modalContent", void 0);
ModalMessage = __decorate([
    Component({
        selector: "modalMessage",
        templateUrl: "modalMessage.component.html"
    }),
    Injectable()
], ModalMessage);
export { ModalMessage };
//# sourceMappingURL=modalMessage.component.js.map