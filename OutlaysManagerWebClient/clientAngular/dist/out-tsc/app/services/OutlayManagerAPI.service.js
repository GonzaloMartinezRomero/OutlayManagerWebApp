import { __decorate } from "tslib";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { ExceptionAPI } from "../model/ExceptionAPI";
let OutlayManagerAPI = class OutlayManagerAPI {
    constructor(httpClient) {
        this.httpClient = httpClient;
        this.HOST = "http://localhost:5000/";
        this.listaTransacciones = new Array();
    }
    loadTransactions(year, month) {
        var getAllTransactionURL = this.HOST + "Outlay" + "?year=" + year.toString() + "&month=" + month.toString();
        return this.httpClient.get(getAllTransactionURL)
            .pipe(catchError((e) => {
            var exception = this.buildExceptionMessage(e, "Get all transactions");
            throw exception;
        }));
        ;
    }
    saveTransaction(transaction) {
        var CRUDOperationURL = this.HOST + "Outlay";
        let transactionJSON = this.transactionToJSON(transaction);
        let customHeader = { "Accept": "*/*", "Content-Type": "application/json", "Content-Encoding": "gzip,deflate,br" };
        if (transaction.id === 0) {
            return this.httpClient.post(CRUDOperationURL, transactionJSON, { headers: customHeader })
                .pipe(catchError((e) => {
                var exception = this.buildExceptionMessage(e, "Save");
                throw exception;
            }));
            ;
        }
        else {
            return this.httpClient.put(CRUDOperationURL, transactionJSON, { headers: customHeader })
                .pipe(catchError((e) => {
                var exception = this.buildExceptionMessage(e, "Save");
                throw exception;
            }));
            ;
        }
    }
    deleteTransaction(transactionID) {
        var deleteTransactionURL = this.HOST + "Outlay" + "/" + transactionID;
        let customHeader = { "Accept": "*/*", "Content-Type": "application/json", "Content-Encoding": "gzip,deflate,br" };
        return this.httpClient.delete(deleteTransactionURL, { headers: customHeader })
            .pipe(catchError((e) => {
            var exception = this.buildExceptionMessage(e, "Delete");
            throw exception;
        }));
    }
    loadTransactionTypeOutlays() {
        var endPoint = "OutlayInfo/TypeOutlays";
        var requestURLParams = this.HOST + endPoint;
        return this.httpClient.get(requestURLParams)
            .pipe(catchError((e) => {
            var exception = this.buildExceptionMessage(e, endPoint);
            throw exception;
        }));
    }
    loadCodeListTransactions() {
        var endPoint = "OutlayInfo/CodeList";
        var requestURLParams = this.HOST + endPoint;
        return this.httpClient.get(requestURLParams)
            .pipe(catchError((e) => {
            var exception = this.buildExceptionMessage(e, endPoint);
            throw exception;
        }));
    }
    loadYearsAvailabes() {
        var endPoint = "OutlayInfo/YearsAvailabes";
        var requestURLParams = this.HOST + endPoint;
        return this.httpClient.get(requestURLParams)
            .pipe(catchError((e) => {
            var exception = this.buildExceptionMessage(e, endPoint);
            throw exception;
        }));
    }
    buildExceptionMessage(exceptionAPI, endPoint) {
        var exception = new ExceptionAPI();
        exception.EndPoint = endPoint;
        exception.StatusCode = exceptionAPI.status;
        switch (exceptionAPI.status) {
            case 0:
                exception.Message = "API service not available calling to " + this.HOST;
                break;
            default:
                exception.Message = exceptionAPI.toString();
                break;
        }
        return exception;
    }
    transactionToJSON(transaction) {
        var transactionJSON = new TransactionJSON(transaction);
        return JSON.stringify(transactionJSON);
    }
};
OutlayManagerAPI = __decorate([
    Injectable()
], OutlayManagerAPI);
export { OutlayManagerAPI };
class TransactionJSON {
    constructor(transaction) {
        this.id = 0;
        this.amount = 0;
        this.date = "";
        this.detailTransaction = new DetailTransactionJSON();
        this.id = transaction.id;
        this.amount = transaction.amount;
        this.date = this.toLocalTime(transaction.date);
        this.detailTransaction.code = transaction.detailTransaction.code;
        this.detailTransaction.description = transaction.detailTransaction.description;
        this.detailTransaction.type = transaction.detailTransaction.type;
    }
    toLocalTime(date) {
        let year = new Date(date).getFullYear().toString();
        let month = (new Date(date).getMonth() + 1).toString();
        if (month.length === 1)
            month = "0" + month;
        let day = new Date(date).getDate().toString();
        if (day.length === 1)
            day = "0" + day;
        return `${year}-${month}-${day}T00:00:00Z`;
    }
}
class DetailTransactionJSON {
    constructor() {
        this.code = "";
        this.description = "";
        this.type = "";
    }
}
//# sourceMappingURL=OutlayManagerAPI.service.js.map