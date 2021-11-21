import { Component, OnInit } from "@angular/core";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from "../../app.component";
import { MessageView, VerboseType } from "../../model/MessageView";
import { TransactionCodeDTO } from "../../model/TransactionCodeDTO";
import { TransactionDTO } from "../../model/TransactionDTO";
import { TransactionsCalendarContainer } from "../../model/TransactionsCalendarContainer";
import { TransactionTypes } from "../../model/TransactionTypes";
import { TypeTransactionDTO } from "../../model/TypeTransactionDTO";
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
    private setupModalTransactionTypeRef?: NgbModalRef = undefined;

    public readonly AdjustType: string = TransactionTypes.ADJUST;
    public readonly IncomingType: string = TransactionTypes.INCOMING;
    public readonly SpendType: string = TransactionTypes.SPENDING;

    public readonly IMG_SPENDING: string = "expenseArrow.png";
    public readonly IMG_INCOMING: string = "incomingArrow.png";
    public readonly IMG_ADJUST: string = "adjustIcon.png";

    public transactionsCalendar: TransactionsCalendarContainer;
    public transactionView: TransactionDTO = new TransactionDTO();
    public transactionTypeMap: Map<string, TypeTransactionDTO> = new Map<string,TypeTransactionDTO>();
    public transactionCodesMap: Map<string,TransactionCodeDTO> = new Map<string,TransactionCodeDTO>();

    public newCodeTransaction: string = "";

    constructor(public calendarService: CalendarService, private outlayManagerService: OutlayManagerAPI, private modalABM: NgbModal,
                private mainApp: AppComponent)
    {
        this.transactionsCalendar = calendarService.transactionsCalendar;
    }

    ngOnInit(): void {

        this.outlayManagerService.loadTransactionTypeOutlays()
            .subscribe(response => {
                var arrayTypeTransaction: Array<TypeTransactionDTO> = response;

                this.transactionTypeMap = new Map<string, TypeTransactionDTO>();
                arrayTypeTransaction.forEach(x => this.transactionTypeMap.set(x.type, x));

            }, error => { this.mainApp.openModalMessage(this.buildMessageErrorFromAPIError(error,"Load transaction type outlays")); });

        this.loadCodeListTransactions();
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

    public save():void {

        const operationType: string = "Saving Transaction";

        var transactionCodeID: number = this.transactionCodesMap.get(this.transactionView.codeTransaction)?.id ?? 0;
        if (transactionCodeID === 0)
            throw new Error("Internal Error: Transaction code ID not defined!");

        var transactionTypeID: number = this.transactionTypeMap.get(this.transactionView.typeTransaction)?.id ?? 0;
        if (transactionTypeID === 0)
            throw new Error("Internal Error: Transaction type ID not defined!");

        this.transactionView.codeTransactionID = transactionCodeID;
        this.transactionView.typeTransactionID = transactionTypeID;

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
        let transactionInfo = `${transaction.codeTransaction}: ${transaction.amount}€`;

        return transactionInfo;
    }

    public openSetupTransactionTypes(modalSetupTransactionType: any) {

        this.setupModalTransactionTypeRef = this.modalABM.open(modalSetupTransactionType, { scrollable:true });
    }

    public closeModalSetupTransactions() {

        this.setupModalTransactionTypeRef?.close();
        this.setupModalTransactionTypeRef = undefined;
    }

    public deleteTransactionCode(codeID: number) {

        if (codeID > 0)
            this.outlayManagerService.deleteTransactionCode(codeID)
                .subscribe(response => {
                    
                    this.loadCodeListTransactions();

                }, error => {
                    
                    this.mainApp.openModalMessage(this.buildMessageErrorFromAPIError(error, "Delete code transaction"));
                });
    }

    public addTransactionCode(codeTransaction: string) {

        if (codeTransaction?.length > 0) {

            this.outlayManagerService.addTransactionCode(codeTransaction)
                .subscribe(response => {                    
                    this.loadCodeListTransactions();
                    this.newCodeTransaction = "";
                }, error => {
                  
                    this.mainApp.openModalMessage(this.buildMessageErrorFromAPIError(error, "Add code transaction"));
                });

        } else {

            this.mainApp.openModalMessage(this.buildMessageError("Transaction code is empty!", "Add transaction code"));
        }
    }

    private loadCodeListTransactions():void {

        this.outlayManagerService.loadCodeListTransactions()
            .subscribe(response => {

                var transactionCodeArray: Array<TransactionCodeDTO> = response;

                this.transactionCodesMap = new Map<string, TransactionCodeDTO>();
                transactionCodeArray.forEach(x => this.transactionCodesMap.set(x.code, x));

            }, error => { this.mainApp.openModalMessage(this.buildMessageErrorFromAPIError(error, "Load code list transactions")); });
    }

    private copyTransaction(transaction: TransactionDTO): TransactionDTO {
        var transactionCopy: TransactionDTO = new TransactionDTO();

        transactionCopy.id = transaction.id;
        transactionCopy.amount = transaction.amount
        transactionCopy.date = transaction.date

        transactionCopy.description = transaction.description;
        transactionCopy.codeTransactionID = transaction.codeTransactionID;
        transactionCopy.codeTransaction = transaction.codeTransaction;
        transactionCopy.typeTransaction = transaction.typeTransaction;
        transactionCopy.typeTransactionID = transaction.typeTransactionID;

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

    private buildMessageError(error:string,action:string) {

        var messageView = new MessageView();

        messageView.action = action;
        messageView.titleError = error;
        messageView.detail = "";
        messageView.statusCode = "";
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
