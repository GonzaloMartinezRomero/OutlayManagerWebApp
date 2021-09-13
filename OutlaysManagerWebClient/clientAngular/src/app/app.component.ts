import { ViewChild } from '@angular/core';
import { Component, Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MessageView, VerboseType } from './model/MessageView';

@Component({
    selector: 'OutlayManagerMainPage',
    templateUrl: "app.component.html",
  styles: []
})

@Injectable()
export class AppComponent {

    //Carga el contenido del modal usando la etiqueta
    @ViewChild('modalMessage') private modalContent: any;

    public title = 'Outlay Manager Web APP';
    public messageView: MessageView = new MessageView();
    public informationType: VerboseType = VerboseType.Information;
    public errorType: VerboseType = VerboseType.Error;

    private modalRefActive?: NgbModalRef = undefined;
    private queueMessages: Array<MessageView> = new Array<MessageView>();

    constructor(private ngbModal: NgbModal) {        
    }

    public openModalMessage(message: MessageView): void {

        if (this.modalRefActive === undefined) {

            this.messageView = message;
            this.modalRefActive = this.ngbModal.open(this.modalContent, { centered: true, backdrop: 'static', keyboard: false });
        }
        else
        {
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
