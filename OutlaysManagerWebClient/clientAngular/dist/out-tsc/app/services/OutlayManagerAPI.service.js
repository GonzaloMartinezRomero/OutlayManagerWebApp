import { __decorate } from "tslib";
import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { ExceptionAPI } from "../model/ExceptionAPI";
import { UserCredential } from "../model/UserCredentials/UserCredential";
import { Constants } from "../utils/constants";
let OutlayManagerAPI = class OutlayManagerAPI {
    constructor(httpClient) {
        this.httpClient = httpClient;
        this.HOST = "http://localhost:5000/";
    }
    loadAllTransactions() {
        var endPoint = this.HOST + "Transaction/All";
        var header = this.getHeader();
        return this.httpClient.get(endPoint, { headers: header })
            .pipe(catchError((ex) => {
            var exception = this.buildExceptionMessage(ex, "Get all transactions");
            throw exception;
        }));
    }
    loadTransactions(year, month) {
        var endPoint = this.HOST + "Transaction?year=" + year + "&month=" + month;
        var header = this.getHeader();
        return this.httpClient.get(endPoint, { headers: header })
            .pipe(catchError((ex) => {
            var exception = this.buildExceptionMessage(ex, "Get transactions");
            throw exception;
        }));
    }
    loadTransactionsYear(year) {
        var endPoint = this.HOST + "Transaction?year=" + year;
        var header = this.getHeader();
        return this.httpClient.get(endPoint, { headers: header })
            .pipe(catchError((ex) => {
            var exception = this.buildExceptionMessage(ex, "Get transactions");
            throw exception;
        }));
    }
    saveTransaction(transaction) {
        var CRUDOperationURL = this.HOST + "Transaction";
        let transactionJSON = this.transactionToJSON(transaction);
        var header = this.getHeader();
        if (transaction.id === 0) {
            return this.httpClient.post(CRUDOperationURL, transactionJSON, { headers: header })
                .pipe(catchError((e) => {
                var exception = this.buildExceptionMessage(e, "Save");
                throw exception;
            }));
        }
        else {
            return this.httpClient.put(CRUDOperationURL, transactionJSON, { headers: header })
                .pipe(catchError((e) => {
                var exception = this.buildExceptionMessage(e, "Save");
                throw exception;
            }));
        }
    }
    deleteTransaction(transactionID) {
        var deleteTransactionURL = this.HOST + "Transaction" + "/" + transactionID;
        var header = this.getHeader();
        return this.httpClient.delete(deleteTransactionURL, { headers: header })
            .pipe(catchError((e) => {
            var exception = this.buildExceptionMessage(e, "Delete");
            throw exception;
        }));
    }
    loadTransactionTypeOutlays() {
        var endPoint = "TransactionInfo/TransactionTypes";
        var requestURLParams = this.HOST + endPoint;
        return this.httpClient.get(requestURLParams)
            .pipe(catchError((e) => {
            var exception = this.buildExceptionMessage(e, endPoint);
            throw exception;
        }));
    }
    loadCodeListTransactions() {
        var endPoint = "TransactionInfo/TransactionCodes";
        var requestURLParams = this.HOST + endPoint;
        return this.httpClient.get(requestURLParams)
            .pipe(catchError((e) => {
            var exception = this.buildExceptionMessage(e, endPoint);
            throw exception;
        }));
    }
    loadYearsAvailabes() {
        var endPoint = "TransactionInfo/YearsAvailabes";
        var requestURLParams = this.HOST + endPoint;
        return this.httpClient.get(requestURLParams)
            .pipe(catchError((e) => {
            var exception = this.buildExceptionMessage(e, endPoint);
            throw exception;
        }));
    }
    deleteTransactionCode(transactionCodeID) {
        var deleteTransactionCodeURL = this.HOST + "Transaction/TransactionCode/" + transactionCodeID;
        var header = this.getHeader();
        return this.httpClient.delete(deleteTransactionCodeURL, { headers: header })
            .pipe(catchError((e) => {
            var exception = this.buildExceptionMessage(e, "DeleteTransactionCode");
            throw exception;
        }));
    }
    addTransactionCode(transactionCode) {
        var endPoint = this.HOST + "Transaction/TransactionCode";
        let transactionCodeJSON = this.transactionCodeToJSON(transactionCode);
        var header = this.getHeader();
        return this.httpClient.post(endPoint, transactionCodeJSON, { headers: header })
            .pipe(catchError((e) => {
            var exception = this.buildExceptionMessage(e, "Add Transaction Code");
            throw exception;
        }));
    }
    requestJWTTokenAuthorization(userLogin, password) {
        var endPoint = this.HOST + "Identity/Authenticate";
        let header = { "Accept": "*/*", "Content-Type": "application/json", "Content-Encoding": "gzip,deflate,br" };
        let body = new UserCredential();
        body.userName = userLogin;
        body.password = password;
        return this.httpClient.post(endPoint, body, { headers: header })
            .pipe(catchError((e) => {
            var exception = this.buildExceptionMessage(e, "Request JWT token");
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
            case 500:
                exception.Message = exceptionAPI.detail;
                break;
            case 404:
                exception.Message = "Not Found";
                break;
            case 401:
                exception.Message = "Unauthorized";
                break;
            default:
                exception.Message = "Error trying access to API";
                break;
        }
        return exception;
    }
    transactionToJSON(transaction) {
        var transactionJSON = new TransactionJSON(transaction);
        return JSON.stringify(transactionJSON);
    }
    transactionCodeToJSON(transactionCode) {
        var transactionCodeJSON = new TransactionCodeJSON(transactionCode);
        return JSON.stringify(transactionCodeJSON);
    }
    getHeader() {
        var token = sessionStorage.getItem(Constants.TOKEN_OUTLAYMANAGER_ID);
        var httpHeader;
        if (token != null && token != "") {
            httpHeader = new HttpHeaders({ "Accept": "*/*", "Content-Type": "application/json", "Content-Encoding": "gzip,deflate,br", "Authorization": "Bearer " + token });
        }
        else {
            httpHeader = new HttpHeaders({ "Accept": "*/*", "Content-Type": "application/json", "Content-Encoding": "gzip,deflate,br" });
        }
        return httpHeader;
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
        this.description = "";
        this.codeTransactionID = 0;
        this.codeTransaction = "";
        this.typeTransactionID = 0;
        this.typeTransaction = "";
        this.id = transaction.id;
        this.amount = transaction.amount;
        this.date = this.toLocalTime(transaction.date);
        this.description = transaction.description;
        this.codeTransactionID = transaction.codeTransactionID;
        this.codeTransaction = transaction.codeTransaction;
        this.typeTransaction = transaction.typeTransaction;
        this.typeTransactionID = transaction.typeTransactionID;
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
class TransactionCodeJSON {
    constructor(_code) {
        this.id = 0;
        this.code = "";
        this.code = _code;
    }
}
//# sourceMappingURL=outlayManagerAPI.service.js.map