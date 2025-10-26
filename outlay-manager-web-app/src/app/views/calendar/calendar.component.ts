import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DateCalendar } from "../../model/DateCalendar";
import { MessageView, VerboseType } from "../../model/MessageView";
import { TransactionCodeDTO } from "../../model/TransactionCodeDTO";
import { TransactionDTO } from "../../model/TransactionDTO";
import { TransactionsCalendarContainer } from "../../model/TransactionsCalendarContainer";
import { TypeTransactionDTO } from "../../model/TypeTransactionDTO";
import { CalendarService } from "../../services/calendar.service";
import { OutlayManagerAPI } from "../../services/outlayManagerAPI.service";
import { ExceptionUtils } from "../../utils/exceptionUtils";
import { TransactionTypes } from "../../utils/TransactionTypes";
import { NotificationEvent } from "../notification/notification.component";
import { ResumeMonthTransaction } from "../resumeMonthTransaction/resumeMonthTransaction.component";
import { ResumeOutlays } from "../resumeOutlays/resumeOutlays.component";

@Component(
    {
        selector: "calendar",
        templateUrl:"calendar.component.html"
    }
)

export class Calendar implements OnInit {

    @ViewChild("notificationComponent") private notificationComponent: NotificationEvent | undefined;
    @ViewChild("resumeMonthTransactionExpenses") private resumeMonthExpensesComponent: ResumeMonthTransaction | undefined;
    @ViewChild("resumeMonthTransactionIncomings") private resumeMonthIncomingsComponent: ResumeMonthTransaction | undefined;
    @ViewChild(ResumeOutlays) private resumeOutlaysComponent: ResumeOutlays | undefined;

    private deleteConfirmationModalRef?: NgbModalRef = undefined;
    private setupModalTransactionTypeRef?: NgbModalRef = undefined;

    public readonly IncomingType: string = TransactionTypes.INCOMING;
    public readonly SpendType: string = TransactionTypes.SPENDING;

    public readonly IMG_SPENDING: string = "expenseArrow.png";
    public readonly IMG_INCOMING: string = "incomingArrow.png";

    public transactionsCalendar: TransactionsCalendarContainer = new TransactionsCalendarContainer();
    public transactionView: TransactionDTO = new TransactionDTO();
    public transactionTypeMap: Map<string, TypeTransactionDTO> = new Map<string,TypeTransactionDTO>();
    public transactionCodesMap: Map<string,TransactionCodeDTO> = new Map<string,TransactionCodeDTO>();

    public newCodeTransaction: string = "";

    constructor(public calendarService: CalendarService, private outlayManagerApiService: OutlayManagerAPI, private modalABM: NgbModal)
    {
        this.calendarService.calendarContainerSubject
                            .subscribe(response =>
        {
            this.loadCalendar(response);
        });
    }

    ngOnInit(): void {

        this.outlayManagerApiService.loadTransactionTypeOutlays()
            .subscribe(response => {
                var arrayTypeTransaction: Array<TypeTransactionDTO> = response;

                this.transactionTypeMap = new Map<string, TypeTransactionDTO>();
                arrayTypeTransaction.forEach(x => this.transactionTypeMap.set(x.type, x));

            }, error => { this.notificationComponent?.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error)); });

        this.loadCodeListTransactions();
    }

    public loadCalendar(transactionCalendarContainer: TransactionsCalendarContainer) {

        if (transactionCalendarContainer.isError) {

            this.notificationComponent?.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(transactionCalendarContainer.exceptionAPI));

        } else {

            //Update main class calendar
            this.transactionsCalendar = transactionCalendarContainer;

            //Update childs values
            this.resumeMonthExpensesComponent?.loadTransactionsResume(transactionCalendarContainer.year, transactionCalendarContainer.month, true);
            this.resumeMonthIncomingsComponent?.loadTransactionsResume(transactionCalendarContainer.year, transactionCalendarContainer.month, false);
            this.resumeOutlaysComponent?.loadMonthResume(transactionCalendarContainer.year, transactionCalendarContainer.month);
        }
    }

    public updateCalendarDate(dateCalendar: DateCalendar|null) {

        //If not specified nothing reload calendar with the latest date
        if (dateCalendar == null) {

            this.calendarService.loadTransactionsCalendar(this.transactionsCalendar.year, this.transactionsCalendar.month);

        } else {
            
            this.calendarService.loadTransactionsCalendar(dateCalendar.Year, dateCalendar.Month);
        }
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

        this.outlayManagerApiService.saveTransaction(this.transactionView)
            .subscribe(response => {

                this.calendarService.loadTransactionsCalendar(this.transactionsCalendar.year, this.transactionsCalendar.month);
                this.closeTransactionConfigurationModal();
                this.notificationComponent?.openModalMessage(this.buildSucessAPIResponse(response, operationType));

            },
                error => {
                    this.notificationComponent?.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
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

            this.outlayManagerApiService.deleteTransaction(transactionID)
                .subscribe(response => {
                    
                    this.calendarService.loadTransactionsCalendar(this.transactionsCalendar.year, this.transactionsCalendar.month);
                    this.closeTransactionConfigurationModal();

                    this.notificationComponent?.openModalMessage(this.buildSucessAPIResponse(response, operationType));
                }, error => { this.notificationComponent?.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));});
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
            this.outlayManagerApiService.deleteTransactionCode(codeID)
                .subscribe(response => {
                    
                    this.loadCodeListTransactions();

                }, error => {
                    
                    this.notificationComponent?.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
                });
    }

    public addTransactionCode(codeTransaction: string) {

        if (codeTransaction?.length > 0) {

            this.outlayManagerApiService.addTransactionCode(codeTransaction)
                .subscribe(response => {                    
                    this.loadCodeListTransactions();
                    this.newCodeTransaction = "";
                }, error => {
                  
                    this.notificationComponent?.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
                });

        } else {

            this.notificationComponent?.openModalMessage(this.buildMessageError("Transaction code is empty!", "Add transaction code"));
        }
    }

    public downloadPendingTransactions(): void {

    this.notificationComponent?.showLoading("Downloading pending transactions...");

    this.outlayManagerApiService.getPendingTransactions()
      .subscribe(result => {
        var numberOfTransactions: number = result.length;

        if (numberOfTransactions == 0) {

          this.notificationComponent?.finalizeLoading("No transactions for sync");

        } else {

          this.updateCalendarDate(null);
          this.notificationComponent?.finalizeLoading(`Added ${numberOfTransactions} transactions`);
        }

      }, error => {
        console.log(error);
        this.notificationComponent?.closeLoadingModal();
        this.notificationComponent?.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
      });
  }

    public downloadAllTransactions(): void {

      this.outlayManagerApiService.downloadAllTransactions().subscribe(blob =>
      {
        // Create a link element
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);

        a.href = objectUrl;
        a.click();

        URL.revokeObjectURL(objectUrl);
      });
    }

    private loadCodeListTransactions():void {

        this.outlayManagerApiService.loadCodeListTransactions()
            .subscribe(response => {

                var transactionCodeArray: Array<TransactionCodeDTO> = response;

                this.transactionCodesMap = new Map<string, TransactionCodeDTO>();
                transactionCodeArray.forEach(x => this.transactionCodesMap.set(x.code, x));

            }, error => { this.notificationComponent?.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error)); });
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
