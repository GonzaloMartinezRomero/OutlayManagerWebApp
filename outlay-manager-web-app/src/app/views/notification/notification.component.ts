import { Component, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MessageView, VerboseType } from '../../model/MessageView';


@Component({
    selector: 'notification-event',
    templateUrl: "notification.component.html",
    styleUrls: ['notification.component.scss']
})

export class NotificationEvent {

    @ViewChild('loadingModal') private loadingTemplateRef: any;
    @ViewChild('notificationModal') private notificationModalRef: any;

    private loadingModal?: any;

    private modalRefActive?: NgbModalRef = undefined;
    private queueMessages: Array<MessageView> = new Array<MessageView>();

    public loadingMessage: string = "";
    public isModalLoadingMode: boolean = true;

    public messageView: MessageView = new MessageView();
    public informationType: VerboseType = VerboseType.Information;
    public errorType: VerboseType = VerboseType.Error;


    constructor(private ngbModal: NgbModal) { }

    public showLoading(message:string): void {

        this.loadingMessage = message;
        this.isModalLoadingMode = true;

        this.loadingModal = this.ngbModal.open(this.loadingTemplateRef, {
            centered: true, backdrop: 'static', keyboard: false
        });
    }

    public finalizeLoading(message:string):void {
      
        this.loadingMessage = message;
        this.isModalLoadingMode = false;
    }

    public closeLoadingModal(): void {

        this.loadingModal?.close();
    }

    public openModalMessage(message: MessageView): void {

        if (this.modalRefActive === undefined) {
        
            this.messageView = message;
            this.modalRefActive = this.ngbModal.open(this.notificationModalRef, { centered: true, backdrop: 'static', keyboard: false });
        }
        else {
            this.queueMessages.push(message);
        }
    }

    public closeModalMessage(): void {

        if (this.queueMessages.length > 0) {
            this.messageView = this.queueMessages.pop() ?? new MessageView();
        
        } else {
            this.modalRefActive?.close();
            this.modalRefActive = undefined;
        }
    }
   
}
