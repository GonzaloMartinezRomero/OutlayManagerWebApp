﻿import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { AmountResume } from "../model/AmountResume";
import { ExceptionAPI } from "../model/ExceptionAPI";
import { ResponseTransactionAPI } from "../model/ResponseTransactionAPI";
import { TransactionCodeDTO } from "../model/TransactionCodeDTO";
import { TransactionDTO } from "../model/TransactionDTO";
import { TypeTransactionDTO } from "../model/TypeTransactionDTO";
import { AuthenticationToken } from "../model/UserCredentials/AuthenticationToken";
import { UserCredential } from "../model/UserCredentials/UserCredential";
import { TokenStorage } from "../utils/tokenStorage";

@Injectable()
export class OutlayManagerAPI {

    constructor(private httpClient: HttpClient) { }

    public loadAllTransactions(): Observable<TransactionDTO[]> {

        var endPoint: string = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.Transactions;

        var header: HttpHeaders = this.getHeader();

        return this.httpClient.get<TransactionDTO[]>(endPoint, { headers: header})
            .pipe(catchError((ex: any) => {

                var exception = this.buildExceptionMessage(ex, "Get all transactions");
                throw exception;
            }));
    }

    public loadTransactions(year: number, month: number): Observable<TransactionDTO[]>
    {
        var endPoint: string = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.Transactions + "?year=" + year + "&month=" + month;

        var header: HttpHeaders = this.getHeader();

        return this.httpClient.get<TransactionDTO[]>(endPoint, { headers: header })
            .pipe(catchError((ex: any) => {
                
                var exception = this.buildExceptionMessage(ex, "Get transactions");
                throw exception;
            }));
    }

    public loadTransactionsYear(year: number): Observable<TransactionDTO[]> {

        var endPoint: string = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.Transactions + "?year=" + year;
        var header: HttpHeaders = this.getHeader();

        return this.httpClient.get<TransactionDTO[]>(endPoint, { headers:header })
            .pipe(catchError((ex: any) => {

                var exception = this.buildExceptionMessage(ex, "Get transactions");
                throw exception;
            }));
    }

    public loadAmountResumes(): Observable<AmountResume[]> {

        var endPoint: string = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.TransactionsInfo.AmountResumes;
        var header: HttpHeaders = this.getHeader();

        return this.httpClient.get<AmountResume[]>(endPoint, { headers: header })
            .pipe(catchError((ex: any) => {

                var exception = this.buildExceptionMessage(ex, "Get Amount Resume");
                throw exception;
            }));
    }

    public saveTransaction(transaction: TransactionDTO): Observable<ResponseTransactionAPI> {

        var endpoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.Transactions;
        let transactionJSON = this.transactionToJSON(transaction);
        var header: HttpHeaders = this.getHeader();

        if (transaction.id === 0) {

            return this.httpClient.post<ResponseTransactionAPI>(endpoint, transactionJSON, { headers: header })
                .pipe(catchError((e: any) => {

                    var exception = this.buildExceptionMessage(e, "Save");
                    throw exception;
                }));
        }
        else {

            return this.httpClient.put<ResponseTransactionAPI>(endpoint, transactionJSON, { headers: header })
                .pipe(catchError((e: any) => {

                    var exception = this.buildExceptionMessage(e, "Save");
                    throw exception;
                }));
        }
    }

    public deleteTransaction(transactionID: number): Observable<ResponseTransactionAPI> {

        var endpoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.Transactions + "/" + transactionID;
        var header: HttpHeaders = this.getHeader();

        return this.httpClient.delete<ResponseTransactionAPI>(endpoint, { headers: header })
            .pipe(catchError((e: any) => {

                var exception = this.buildExceptionMessage(e, "Delete");
                throw exception;
            }));
    
    }

    public loadTransactionTypeOutlays(): Observable<Array<TypeTransactionDTO>> {

        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.TransactionsInfo.TransactionTypes;
        
        return this.httpClient.get<TypeTransactionDTO[]>(endPoint)
                              .pipe(catchError((e: any) => {
                              
                                  var exception = this.buildExceptionMessage(e, endPoint);
                                  throw exception;
                              }));
    }

    public loadCodeListTransactions(): Observable<Array<TransactionCodeDTO>> {

        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.TransactionsCode;
        
        return this.httpClient.get<TransactionCodeDTO[]>(endPoint)
            .pipe(catchError((e: any) => {

                var exception = this.buildExceptionMessage(e, endPoint);
                throw exception;
            }));
    }

    public loadYearsAvailabes(): Observable<Array<number>> {

        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.TransactionsInfo.TransactionYearsAvailables;
       
        return this.httpClient.get<number[]>(endPoint)
                              .pipe(catchError((e: any) => {

                                  var exception = this.buildExceptionMessage(e, endPoint);
                                  throw exception;
                              }));
    }

    public deleteTransactionCode(transactionCodeID: number): Observable<any> {

        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.TransactionsCode + "/" + transactionCodeID;
        var header: HttpHeaders = this.getHeader();

        return this.httpClient.delete<any>(endPoint, { headers: header })
            .pipe(catchError((e: any) => {

                var exception = this.buildExceptionMessage(e, "DeleteTransactionCode");
                throw exception;
            }));
    }

    public addTransactionCode(transactionCode: string):Observable<any> {

        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.TransactionsCode;
        let transactionCodeJSON = this.transactionCodeToJSON(transactionCode);
        var header: HttpHeaders = this.getHeader();

        return this.httpClient.post<ResponseTransactionAPI>(endPoint, transactionCodeJSON, { headers: header })
            .pipe(catchError((e: any) => {

                var exception = this.buildExceptionMessage(e, "Add Transaction Code");
                throw exception;
            }));
    }

    public requestJWTTokenAuthorization(userLogin: string, password: string): Observable<AuthenticationToken> {

        var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.Authorization;
        let header = { "Accept": "*/*", "Content-Type": "application/json", "Content-Encoding": "gzip,deflate,br" };
        let body = new UserCredential();
        body.userName = userLogin;
        body.password = password;

        return this.httpClient.post<AuthenticationToken>(endPoint, body, { headers: header })
            .pipe(catchError((e: any) => {                

                var exception = this.buildExceptionMessage(e, "Request JWT token");
                throw exception;
            }));
    }

    public async isTokenValid(token: string): Promise<boolean> {

        var endPoint: string = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.Transactions + "/1";
        var header: HttpHeaders = this.getHeader();

        var tokenIsValid: boolean = false;

        try {

            var result = await this.httpClient.get<any>(endPoint, { headers: header })
                .pipe(catchError((e: any) => {
                    throw new ExceptionAPI();
                }))
                .toPromise();

            tokenIsValid = (result != null);
        }
        catch (exception: any)
        {
            console.error("Token is not valid");
        }

        return tokenIsValid;
    }

    public downloadRemoteTransaction(): Observable<TransactionDTO[]> {

        var endPoint: string = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.DownloadExternalTransaction;

        var header: HttpHeaders = this.getHeader();

        console.log(endPoint);
        console.log(header);

        return this.httpClient.get<TransactionDTO[]>(endPoint, { headers: header })
            .pipe(catchError((ex: any) => {

                var exception = this.buildExceptionMessage(ex, "Download remote transactions");
                throw exception;
            }));
    }

    private buildExceptionMessage(exceptionAPI: any, endPoint: string): ExceptionAPI {

        var exception = new ExceptionAPI();
        exception.EndPoint = endPoint;
        exception.StatusCode = exceptionAPI.status;

        switch (exceptionAPI.status) {
            case 0:
                exception.Message = "API service not available calling to " + environment.hostOutlayManagerAPI;
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
            case 400:
                exception.Message = "Bad Request";
                break;
            default:
                exception.Message = "Error trying access to API";
                break;
        }

        return exception;
    }

    private transactionToJSON(transaction: TransactionDTO): string {

        var transactionJSON: TransactionJSON = new TransactionJSON(transaction);

        return JSON.stringify(transactionJSON);
    }

    private transactionCodeToJSON(transactionCode: string): string{

        var transactionCodeJSON: TransactionCodeDTO = new TransactionCodeJSON(transactionCode);
        return JSON.stringify(transactionCodeJSON);
    }    

    private getHeader(): HttpHeaders {

        var token: string | null = TokenStorage.getToken();
        var httpHeader: HttpHeaders;

        if (token != null && token != "") {
            httpHeader = new HttpHeaders({ "Accept": "*/*", "Content-Type": "application/json", "Content-Encoding": "gzip,deflate,br", "Authorization": "Bearer " + token });
        }
        else {
            httpHeader = new HttpHeaders({ "Accept": "*/*", "Content-Type": "application/json", "Content-Encoding": "gzip,deflate,br"});
        }
        
        return httpHeader;
    }
}

class TransactionJSON {

    id: number = 0;
    amount: number = 0;
    date: string = "";
    description: string = "";
    codeTransactionID: number = 0;
    codeTransaction: string = "";
    typeTransactionID: number = 0;
    typeTransaction: string = "";

    constructor(transaction: TransactionDTO) {
        this.id = transaction.id;
        this.amount = transaction.amount;
        this.date = this.toLocalTime(transaction.date);
        this.description = transaction.description;
        this.codeTransactionID = transaction.codeTransactionID;
        this.codeTransaction = transaction.codeTransaction;
        this.typeTransaction = transaction.typeTransaction;
        this.typeTransactionID = transaction.typeTransactionID;
    }

    private toLocalTime(date: Date): string {

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
    id: number = 0;
    code: string = "";

    constructor(_code: string) {
        this.code = _code;
    }
}


