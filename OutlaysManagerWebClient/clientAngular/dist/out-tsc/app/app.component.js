import { __decorate } from "tslib";
import { ViewChild } from '@angular/core';
import { Component, Injectable } from '@angular/core';
import { MessageView, VerboseType } from './model/MessageView';
let AppComponent = class AppComponent {
    constructor(ngbModal) {
        this.ngbModal = ngbModal;
        this.title = 'Outlay Manager Web APP';
        this.messageView = new MessageView();
        this.messagesQueue = new Array();
        this.informationType = VerboseType.Information;
        this.errorType = VerboseType.Error;
    }
    openModalMessage(message) {
        this.messageView = message;
        this.messagesQueue.unshift(this.ngbModal.open(this.modalContent, { centered: true }));
        var a = this.ngbModal.open(this.modalContent, { centered: true });
        console.log(a);
    }
    closeModalMessage() {
        var _a;
        console.log(this.messagesQueue);
        console.log(this.ngbModal.activeInstances.length);
        //En el caso de tener varios modales abiertos habr�a que ir cerrando como cola LIFO
        //Como se van guardando al final, siempre voy a eliminar el primero
        if (this.messagesQueue.length > 0) {
            (_a = this.messagesQueue.pop()) === null || _a === void 0 ? void 0 : _a.close();
        }
        console.log(this.messagesQueue);
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