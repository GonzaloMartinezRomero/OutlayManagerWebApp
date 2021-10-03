import { __decorate } from "tslib";
import { Component } from "@angular/core";
import { MessageView, VerboseType } from "../../model/MessageView";
import { DetailTransaction, TransactionDTO, Type } from "../../model/TransactionDTO";
let Calendar = class Calendar {
    constructor(calendarService, outlayManagerService, modalABM, mainApp) {
        this.calendarService = calendarService;
        this.outlayManagerService = outlayManagerService;
        this.modalABM = modalABM;
        this.mainApp = mainApp;
        this.deleteConfirmationModalRef = undefined;
        this.AdjustType = Type.Adjust;
        this.IncomingType = Type.Incoming;
        this.SpendType = Type.Spending;
        this.PATH_IMG_SPENDING = "clientAngular/assets/img/expenseArrow.png";
        this.PATH_IMG_INCOMING = "clientAngular/assets/img/incomingArrow.png";
        this.PATH_IMG_ADJUST = "clientAngular/assets/img/adjustIcon.png";
        this.transactionView = new TransactionDTO();
        this.transactionTypeArray = new Array();
        this.transactionCodesArray = new Array();
        this.transactionsCalendar = calendarService.transactionsCalendar;
    }
    ngOnInit() {
        this.outlayManagerService.loadTransactionTypeOutlays()
            .subscribe(response => {
            this.transactionTypeArray = response;
        }, error => { this.mainApp.openModalMessage(this.buildMessageErrorFromAPIError(error, "Load transaction type outlays")); });
        this.outlayManagerService.loadCodeListTransactions()
            .subscribe(response => {
            this.transactionCodesArray = response;
        }, error => { this.mainApp.openModalMessage(this.buildMessageErrorFromAPIError(error, "Load code list transactions")); });
    }
    openTransactionConfigModal(modalTemplate, transaction, day) {
        if (transaction === undefined) {
            if (day === undefined)
                throw new Error("Day must be defined!");
            let transactionNew = new TransactionDTO();
            transactionNew.date = new Date(this.transactionsCalendar.year, this.transactionsCalendar.month - 1, day);
            this.transactionView = transactionNew;
        }
        else {
            this.transactionView = this.copyTransaction(transaction);
        }
        this.modalABM.open(modalTemplate);
    }
    openDeleteConfirmationModal(modalTemplate) {
        this.deleteConfirmationModalRef = this.modalABM.open(modalTemplate);
    }
    save() {
        const operationType = "Saving Transaction";
        this.outlayManagerService.saveTransaction(this.transactionView)
            .subscribe(response => {
            this.calendarService.loadTransactionsCalendar(this.transactionsCalendar.year, this.transactionsCalendar.month);
            this.closeTransactionConfigurationModal();
            this.mainApp.openModalMessage(this.buildSucessAPIResponse(response, operationType));
        }, error => {
            this.mainApp.openModalMessage(this.buildMessageErrorFromAPIError(error, operationType));
        });
    }
    closeTransactionConfigurationModal() {
        this.modalABM.dismissAll();
    }
    responseDeleteTransaction(deleteTransaction) {
        var _a;
        if (deleteTransaction) {
            const operationType = "Delete Transaction";
            var transactionID = this.transactionView.id;
            this.outlayManagerService.deleteTransaction(transactionID)
                .subscribe(response => {
                this.calendarService.loadTransactionsCalendar(this.transactionsCalendar.year, this.transactionsCalendar.month);
                this.closeTransactionConfigurationModal();
                this.mainApp.openModalMessage(this.buildSucessAPIResponse(response, operationType));
            }, error => { this.mainApp.openModalMessage(this.buildMessageErrorFromAPIError(error, operationType)); });
        }
        else {
            (_a = this.deleteConfirmationModalRef) === null || _a === void 0 ? void 0 : _a.close();
        }
    }
    toTransactionView(transaction) {
        //let transactionInfo = `[${transaction.detailTransaction.type.toString()}] ${transaction.detailTransaction.code}: ${transaction.amount}€`;
        let transactionInfo = `${transaction.detailTransaction.code}: ${transaction.amount}€`;
        return transactionInfo;
    }
    copyTransaction(transaction) {
        var transactionCopy = new TransactionDTO();
        transactionCopy.id = transaction.id;
        transactionCopy.amount = transaction.amount;
        transactionCopy.date = transaction.date;
        transactionCopy.detailTransaction = new DetailTransaction();
        transactionCopy.detailTransaction.code = transaction.detailTransaction.code;
        transactionCopy.detailTransaction.description = transaction.detailTransaction.description;
        transactionCopy.detailTransaction.type = transaction.detailTransaction.type;
        return transactionCopy;
    }
    buildMessageErrorFromAPIError(error, action) {
        var messageView = new MessageView();
        messageView.action = action;
        messageView.titleError = error.Message;
        messageView.detail = "Calling EndPoint: " + error.EndPoint;
        messageView.statusCode = error.StatusCode;
        messageView.verbose = VerboseType.Error;
        return messageView;
    }
    buildSucessAPIResponse(response, action) {
        var messageView = new MessageView();
        messageView.action = action;
        messageView.detail = response.Message;
        messageView.verbose = VerboseType.Information;
        return messageView;
    }
};
Calendar = __decorate([
    Component({
        selector: "calendar",
        templateUrl: "calendar.component.html"
    })
], Calendar);
export { Calendar };
//# sourceMappingURL=calendar.component.js.map