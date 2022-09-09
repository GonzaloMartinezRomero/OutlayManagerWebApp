import { __decorate } from "tslib";
import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { ExceptionAPI } from "../model/ExceptionAPI";
import { UserCredential } from "../model/UserCredentials/UserCredential";
import { TokenStorage } from "../utils/tokenStorage";
let OutlayManagerAPI = class OutlayManagerAPI {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    loadAllTransactions() {
        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.Transactions;
        var header = this.getHeader();
        return this.httpClient.get(endPoint, { headers: header })
            .pipe(catchError((ex) => {
            var exception = this.buildExceptionMessage(ex, "Get all transactions");
            throw exception;
        }));
    }
    loadTransactions(year, month) {
        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.Transactions + "?year=" + year + "&month=" + month;
        var header = this.getHeader();
        return this.httpClient.get(endPoint, { headers: header })
            .pipe(catchError((ex) => {
            var exception = this.buildExceptionMessage(ex, "Get transactions");
            throw exception;
        }));
    }
    loadTransactionsYear(year) {
        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.Transactions + "?year=" + year;
        var header = this.getHeader();
        return this.httpClient.get(endPoint, { headers: header })
            .pipe(catchError((ex) => {
            var exception = this.buildExceptionMessage(ex, "Get transactions");
            throw exception;
        }));
    }
    loadAmountResumes() {
        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.TransactionsInfo.AmountResumes;
        var header = this.getHeader();
        return this.httpClient.get(endPoint, { headers: header })
            .pipe(catchError((ex) => {
            var exception = this.buildExceptionMessage(ex, "Get Amount Resume");
            throw exception;
        }));
    }
    saveTransaction(transaction) {
        var endpoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.Transactions;
        let transactionJSON = this.transactionToJSON(transaction);
        var header = this.getHeader();
        if (transaction.id === 0) {
            return this.httpClient.post(endpoint, transactionJSON, { headers: header })
                .pipe(catchError((e) => {
                var exception = this.buildExceptionMessage(e, "Save");
                throw exception;
            }));
        }
        else {
            return this.httpClient.put(endpoint, transactionJSON, { headers: header })
                .pipe(catchError((e) => {
                var exception = this.buildExceptionMessage(e, "Save");
                throw exception;
            }));
        }
    }
    deleteTransaction(transactionID) {
        var endpoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.Transactions + "/" + transactionID;
        var header = this.getHeader();
        return this.httpClient.delete(endpoint, { headers: header })
            .pipe(catchError((e) => {
            var exception = this.buildExceptionMessage(e, "Delete");
            throw exception;
        }));
    }
    loadTransactionTypeOutlays() {
        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.TransactionsInfo.TransactionTypes;
        return this.httpClient.get(endPoint)
            .pipe(catchError((e) => {
            var exception = this.buildExceptionMessage(e, endPoint);
            throw exception;
        }));
    }
    loadCodeListTransactions() {
        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.TransactionsCode;
        return this.httpClient.get(endPoint)
            .pipe(catchError((e) => {
            var exception = this.buildExceptionMessage(e, endPoint);
            throw exception;
        }));
    }
    loadYearsAvailabes() {
        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.TransactionsInfo.TransactionYearsAvailables;
        return this.httpClient.get(endPoint)
            .pipe(catchError((e) => {
            var exception = this.buildExceptionMessage(e, endPoint);
            throw exception;
        }));
    }
    deleteTransactionCode(transactionCodeID) {
        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.TransactionsCode + "/" + transactionCodeID;
        var header = this.getHeader();
        return this.httpClient.delete(endPoint, { headers: header })
            .pipe(catchError((e) => {
            var exception = this.buildExceptionMessage(e, "DeleteTransactionCode");
            throw exception;
        }));
    }
    addTransactionCode(transactionCode) {
        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.TransactionsCode;
        let transactionCodeJSON = this.transactionCodeToJSON(transactionCode);
        var header = this.getHeader();
        return this.httpClient.post(endPoint, transactionCodeJSON, { headers: header })
            .pipe(catchError((e) => {
            var exception = this.buildExceptionMessage(e, "Add Transaction Code");
            throw exception;
        }));
    }
    requestJWTTokenAuthorization(userLogin, password) {
        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.Authorization;
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
    async isTokenValid(token) {
        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.Transactions + "/1";
        var header = this.getHeader();
        var tokenIsValid = false;
        try {
            var result = await this.httpClient.get(endPoint, { headers: header })
                .pipe(catchError((e) => {
                throw new ExceptionAPI();
            }))
                .toPromise();
            tokenIsValid = (result != null);
        }
        catch (exception) {
            console.error("Token is not valid");
        }
        return tokenIsValid;
    }
    //Returns transactions saved asynchronously
    synchronizeRemoteTransaction() {
        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.SynchronizeExternalTransaction;
        var header = this.getHeader();
        return this.httpClient.get(endPoint, { headers: header })
            .pipe(catchError((ex) => {
            var exception = this.buildExceptionMessage(ex, "Sync remote transactions");
            throw exception;
        }));
    }
    backupTransactions() {
        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.BackupTransaction;
        var header = this.getHeader();
        return this.httpClient.get(endPoint, { headers: header })
            .pipe(catchError((ex) => {
            var exception = this.buildExceptionMessage(ex, "Backup transactions");
            throw exception;
        }));
    }
    downloadBackupFileTransactions() {
        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.DownloadBackupTransaction;
        var header = this.getHeader();
        return this.httpClient.get(endPoint, { headers: header, responseType: 'blob' })
            .pipe(catchError((ex) => {
            var exception = this.buildExceptionMessage(ex, "Backup transactions");
            throw exception;
        }));
    }
    buildExceptionMessage(exceptionAPI, endPoint) {
        console.log("Exception api");
        console.log(exceptionAPI);
        var exceptionErrorAPI = exceptionAPI.error;
        var exception = new ExceptionAPI();
        exception.EndPoint = endPoint;
        exception.StatusCode = exceptionErrorAPI.status;
        switch (exceptionErrorAPI.status) {
            case 0:
                exception.Message = "API service not available calling to " + environment.hostOutlayManagerAPI;
                break;
            case 500:
                exception.Message = exceptionErrorAPI.detail;
                break;
            case 404:
                exception.Message = "Not Found";
                break;
            case 401:
                exception.Message = "Unauthorized";
                break;
            case 400:
                exception.Message = "Bad Request";
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
        var token = TokenStorage.getToken();
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