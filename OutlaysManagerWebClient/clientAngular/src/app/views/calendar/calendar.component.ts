import { Component, OnInit } from "@angular/core";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from "../../app.component";
import { MessageView, VerboseType } from "../../model/MessageView";
import { DetailTransaction, TransactionDTO, Type } from "../../model/TransactionDTO";
import { TransactionsCalendarContainer } from "../../model/TransactionsCalendarContainer";
import { CalendarService } from "../../services/calendar.service";
import { OutlayManagerAPI } from "../../services/OutlayManagerAPI.service";


@Component(
    {
        selector: "calendar",
        templateUrl:"calendar.component.html"
    }
)

export class Calendar implements OnInit {

    private deleteConfirmationModalRef?: NgbModalRef = undefined;


    public AdjustType: Type = Type.Adjust;
    public IncomingType: Type = Type.Incoming;
    public SpendType: Type = Type.Spending;

    public  PATH_IMG_SPENDING: string = "clientAngular/assets/img/expenseArrow.png";
    public PATH_IMG_INCOMING: string = "clientAngular/assets/img/incomingArrow.png";
    public PATH_IMG_ADJUST: string = "clientAngular/assets/img/adjustIcon.png";

    public transactionsCalendar: TransactionsCalendarContainer;
    public transactionView: TransactionDTO = new TransactionDTO();
    public transactionTypeArray: Array<string> = new Array<string>();
    public transactionCodesArray: Array<string> = new Array<string>();

    constructor(public calendarService: CalendarService, private outlayManagerService: OutlayManagerAPI, private modalABM: NgbModal,
                private mainApp: AppComponent)
    {
        this.transactionsCalendar = calendarService.transactionsCalendar;
    }

    ngOnInit(): void {

        this.outlayManagerService.loadTransactionTypeOutlays()
            .subscribe(response => {
                this.transactionTypeArray = response;
            }, error => { this.mainApp.openModalMessage(this.buildMessageErrorFromAPIError(error,"Load transaction type outlays")); });


        this.outlayManagerService.loadCodeListTransactions()
            .subscribe(response => {
                this.transactionCodesArray = response;
            }, error => { this.mainApp.openModalMessage(this.buildMessageErrorFromAPIError(error, "Load code list transactions"));  });
    }

    public openTransactionConfigModal(modalTemplate: any, transaction: TransactionDTO | undefined, day: number | undefined) {

        if (transaction === undefined)
        {
            if (day === undefined)
                throw new Error("Day must be defined!");

            let transactionNew = new TransactionDTO();         
            transactionNew.date = new Date(this.transactionsCalendar.year, this.transactionsCalendar.month - 1, day);

            this.transactionView = transactionNew;
        }
        else
        {
            this.transactionView = this.copyTransaction(transaction);
        }

        this.modalABM.open(modalTemplate);
    }

    public openDeleteConfirmationModal(modalTemplate: any) {

        this.deleteConfirmationModalRef = this.modalABM.open(modalTemplate);
    }

    public save() {

        const operationType: string = "Saving Transaction";

        this.outlayManagerService.saveTransaction(this.transactionView)
            .subscribe(response => {

                this.calendarService.loadTransactionsCalendar(this.transactionsCalendar.year, this.transactionsCalendar.month);


                this.closeTransactionConfigurationModal();

                this.mainApp.openModalMessage(this.buildSucessAPIResponse(response, operationType));
            },
                error => {
                    this.mainApp.openModalMessage(this.buildMessageErrorFromAPIError(error, operationType));
             });
    }

    public closeTransactionConfigurationModal() {
        this.modalABM.dismissAll();        
    }

    public responseDeleteTransaction(deleteTransaction: boolean) {

        if (deleteTransaction)
        {
            const operationType: string = "Delete Transaction";
            var transactionID: number = this.transactionView.id;

            this.outlayManagerService.deleteTransaction(transactionID)
                .subscribe(response => {
                    
                    this.calendarService.loadTransactionsCalendar(this.transactionsCalendar.year, this.transactionsCalendar.month);
                    this.closeTransactionConfigurationModal();

                    this.mainApp.openModalMessage(this.buildSucessAPIResponse(response, operationType));
                }, error => { this.mainApp.openModalMessage(this.buildMessageErrorFromAPIError(error, operationType));});
        }
        else
        {
           this.deleteConfirmationModalRef?.close();
        }
    }

    public toTransactionView(transaction: TransactionDTO): string
    {
        //let transactionInfo = `[${transaction.detailTransaction.type.toString()}] ${transaction.detailTransaction.code}: ${transaction.amount}€`;
        let transactionInfo = `${transaction.detailTransaction.code}: ${transaction.amount}€`;

        return transactionInfo;
    }

    private copyTransaction(transaction: TransactionDTO): TransactionDTO {
        var transactionCopy: TransactionDTO = new TransactionDTO();

        transactionCopy.id = transaction.id;
        transactionCopy.amount = transaction.amount
        transactionCopy.date = transaction.date

        transactionCopy.detailTransaction = new DetailTransaction();

        transactionCopy.detailTransaction.code = transaction.detailTransaction.code;
        transactionCopy.detailTransaction.description = transaction.detailTransaction.description;
        transactionCopy.detailTransaction.type = transaction.detailTransaction.type;

        return transactionCopy;
    }

    private buildMessageErrorFromAPIError(error: any, action: string): MessageView {

        var messageView = new MessageView();

        messageView.action = action;
        messageView.titleError = error.Message;
        messageView.detail = "Calling EndPoint: "+error.EndPoint;
        messageView.statusCode = error.StatusCode;
        messageView.verbose = VerboseType.Error;

        return messageView;
    }

    private buildSucessAPIResponse(response: any, action: string): MessageView {

        var messageView = new MessageView();

        messageView.action = action;        
        messageView.detail = response.Message;       
        messageView.verbose = VerboseType.Information;

        return messageView;

    }
}
