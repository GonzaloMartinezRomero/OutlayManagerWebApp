import { __decorate } from "tslib";
import { Component, ViewChild } from "@angular/core";
import { MessageView, VerboseType } from "../../model/MessageView";
import { TransactionDTO } from "../../model/TransactionDTO";
import { TransactionsCalendarContainer } from "../../model/TransactionsCalendarContainer";
import { ExceptionUtils } from "../../utils/exceptionUtils";
import { TransactionTypes } from "../../utils/TransactionTypes";
import { ResumeOutlays } from "../resumeOutlays/resumeOutlays.component";
let Calendar = class Calendar {
    constructor(calendarService, outlayManagerApiService, modalABM) {
        this.calendarService = calendarService;
        this.outlayManagerApiService = outlayManagerApiService;
        this.modalABM = modalABM;
        this.deleteConfirmationModalRef = undefined;
        this.setupModalTransactionTypeRef = undefined;
        this.AdjustType = TransactionTypes.ADJUST;
        this.IncomingType = TransactionTypes.INCOMING;
        this.SpendType = TransactionTypes.SPENDING;
        this.IMG_SPENDING = "expenseArrow.png";
        this.IMG_INCOMING = "incomingArrow.png";
        this.IMG_ADJUST = "adjustIcon.png";
        this.transactionsCalendar = new TransactionsCalendarContainer();
        this.transactionView = new TransactionDTO();
        this.transactionTypeMap = new Map();
        this.transactionCodesMap = new Map();
        this.newCodeTransaction = "";
        this.calendarService.calendarContainerSubject
            .subscribe(response => {
            this.loadCalendar(response);
        });
    }
    ngOnInit() {
        this.outlayManagerApiService.loadTransactionTypeOutlays()
            .subscribe(response => {
            var arrayTypeTransaction = response;
            this.transactionTypeMap = new Map();
            arrayTypeTransaction.forEach(x => this.transactionTypeMap.set(x.type, x));
        }, error => { var _a; (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error)); });
        this.loadCodeListTransactions();
    }
    loadCalendar(transactionCalendarContainer) {
        var _a, _b, _c, _d;
        if (transactionCalendarContainer.isError) {
            (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(transactionCalendarContainer.exceptionAPI));
        }
        else {
            //Update main class calendar
            this.transactionsCalendar = transactionCalendarContainer;
            //Update childs values
            (_b = this.resumeMonthExpensesComponent) === null || _b === void 0 ? void 0 : _b.loadTransactionsResume(transactionCalendarContainer.year, transactionCalendarContainer.month, true);
            (_c = this.resumeMonthIncomingsComponent) === null || _c === void 0 ? void 0 : _c.loadTransactionsResume(transactionCalendarContainer.year, transactionCalendarContainer.month, false);
            (_d = this.resumeOutlaysComponent) === null || _d === void 0 ? void 0 : _d.loadMonthResume(transactionCalendarContainer);
        }
    }
    updateCalendarDate(dateCalendar) {
        //If not specified nothing reload calendar with the latest date
        if (dateCalendar == null) {
            this.calendarService.loadTransactionsCalendar(this.transactionsCalendar.year, this.transactionsCalendar.month);
        }
        else {
            this.calendarService.loadTransactionsCalendar(dateCalendar.Year, dateCalendar.Month);
        }
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
        var _a, _b, _c, _d;
        const operationType = "Saving Transaction";
        var transactionCodeID = (_b = (_a = this.transactionCodesMap.get(this.transactionView.codeTransaction)) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 0;
        if (transactionCodeID === 0)
            throw new Error("Internal Error: Transaction code ID not defined!");
        var transactionTypeID = (_d = (_c = this.transactionTypeMap.get(this.transactionView.typeTransaction)) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : 0;
        if (transactionTypeID === 0)
            throw new Error("Internal Error: Transaction type ID not defined!");
        this.transactionView.codeTransactionID = transactionCodeID;
        this.transactionView.typeTransactionID = transactionTypeID;
        this.outlayManagerApiService.saveTransaction(this.transactionView)
            .subscribe(response => {
            var _a;
            this.calendarService.loadTransactionsCalendar(this.transactionsCalendar.year, this.transactionsCalendar.month);
            this.closeTransactionConfigurationModal();
            (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.openModalMessage(this.buildSucessAPIResponse(response, operationType));
        }, error => {
            var _a;
            (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
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
            this.outlayManagerApiService.deleteTransaction(transactionID)
                .subscribe(response => {
                var _a;
                this.calendarService.loadTransactionsCalendar(this.transactionsCalendar.year, this.transactionsCalendar.month);
                this.closeTransactionConfigurationModal();
                (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.openModalMessage(this.buildSucessAPIResponse(response, operationType));
            }, error => { var _a; (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error)); });
        }
        else {
            (_a = this.deleteConfirmationModalRef) === null || _a === void 0 ? void 0 : _a.close();
        }
    }
    toTransactionView(transaction) {
        let transactionInfo = `${transaction.codeTransaction}: ${transaction.amount}€`;
        return transactionInfo;
    }
    openSetupTransactionTypes(modalSetupTransactionType) {
        this.setupModalTransactionTypeRef = this.modalABM.open(modalSetupTransactionType, { scrollable: true });
    }
    closeModalSetupTransactions() {
        var _a;
        (_a = this.setupModalTransactionTypeRef) === null || _a === void 0 ? void 0 : _a.close();
        this.setupModalTransactionTypeRef = undefined;
    }
    deleteTransactionCode(codeID) {
        if (codeID > 0)
            this.outlayManagerApiService.deleteTransactionCode(codeID)
                .subscribe(response => {
                this.loadCodeListTransactions();
            }, error => {
                var _a;
                (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
            });
    }
    addTransactionCode(codeTransaction) {
        var _a;
        if ((codeTransaction === null || codeTransaction === void 0 ? void 0 : codeTransaction.length) > 0) {
            this.outlayManagerApiService.addTransactionCode(codeTransaction)
                .subscribe(response => {
                this.loadCodeListTransactions();
                this.newCodeTransaction = "";
            }, error => {
                var _a;
                (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
            });
        }
        else {
            (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.openModalMessage(this.buildMessageError("Transaction code is empty!", "Add transaction code"));
        }
    }
    loadCodeListTransactions() {
        this.outlayManagerApiService.loadCodeListTransactions()
            .subscribe(response => {
            var transactionCodeArray = response;
            this.transactionCodesMap = new Map();
            transactionCodeArray.forEach(x => this.transactionCodesMap.set(x.code, x));
        }, error => { var _a; (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error)); });
    }
    copyTransaction(transaction) {
        var transactionCopy = new TransactionDTO();
        transactionCopy.id = transaction.id;
        transactionCopy.amount = transaction.amount;
        transactionCopy.date = transaction.date;
        transactionCopy.description = transaction.description;
        transactionCopy.codeTransactionID = transaction.codeTransactionID;
        transactionCopy.codeTransaction = transaction.codeTransaction;
        transactionCopy.typeTransaction = transaction.typeTransaction;
        transactionCopy.typeTransactionID = transaction.typeTransactionID;
        return transactionCopy;
    }
    buildMessageError(error, action) {
        var messageView = new MessageView();
        messageView.action = action;
        messageView.titleError = error;
        messageView.detail = "";
        messageView.statusCode = "";
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
__decorate([
    ViewChild("notificationComponent")
], Calendar.prototype, "notificationComponent", void 0);
__decorate([
    ViewChild("resumeMonthTransactionExpenses")
], Calendar.prototype, "resumeMonthExpensesComponent", void 0);
__decorate([
    ViewChild("resumeMonthTransactionIncomings")
], Calendar.prototype, "resumeMonthIncomingsComponent", void 0);
__decorate([
    ViewChild(ResumeOutlays)
], Calendar.prototype, "resumeOutlaysComponent", void 0);
Calendar = __decorate([
    Component({
        selector: "calendar",
        templateUrl: "calendar.component.html"
    })
], Calendar);
export { Calendar };
//# sourceMappingURL=calendar.component.js.map