import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { ExceptionAPI } from "../model/ExceptionAPI";
import { ResponseTransactionAPI } from "../model/ResponseTransactionAPI";
import { TransactionCodeDTO } from "../model/TransactionCodeDTO";
import { TransactionDTO } from "../model/TransactionDTO";
import { TypeTransactionDTO } from "../model/TypeTransactionDTO";
import { AuthenticationToken } from "../model/UserCredentials/AuthenticationToken";
import { UserCredential } from "../model/UserCredentials/UserCredential";
import { Constants } from "../utils/constants";

@Injectable()
export class OutlayManagerAPI {

    private readonly HOST: string = "http://localhost:5000/";

    constructor(private httpClient: HttpClient) {

    }

    public loadAllTransactions(): Observable<TransactionDTO[]> {

        var endPoint: string = this.HOST + "Transaction/All";
        var header: HttpHeaders = this.getHeader();

        return this.httpClient.get<TransactionDTO[]>(endPoint, { headers: header})
            .pipe(catchError((ex: any) => {

                var exception = this.buildExceptionMessage(ex, "Get all transactions");
                throw exception;
            }));
    }

    public loadTransactions(year: number, month: number): Observable<TransactionDTO[]>
    {   
        var endPoint: string = this.HOST + "Transaction?year=" + year + "&month=" + month;
        var header: HttpHeaders = this.getHeader();

        return this.httpClient.get<TransactionDTO[]>(endPoint, { headers: header })
            .pipe(catchError((ex: any) => {
                
                var exception = this.buildExceptionMessage(ex, "Get transactions");
                throw exception;
            }));
    }

    public loadTransactionsYear(year: number): Observable<TransactionDTO[]> {

        var endPoint: string = this.HOST + "Transaction?year=" + year;
        var header: HttpHeaders = this.getHeader();

        return this.httpClient.get<TransactionDTO[]>(endPoint, { headers:header })
            .pipe(catchError((ex: any) => {

                var exception = this.buildExceptionMessage(ex, "Get transactions");
                throw exception;
            }));
    }

    public saveTransaction(transaction: TransactionDTO): Observable<ResponseTransactionAPI> {

        var CRUDOperationURL = this.HOST + "Transaction";
        let transactionJSON = this.transactionToJSON(transaction);
        var header: HttpHeaders = this.getHeader();

        if (transaction.id === 0) {

            return this.httpClient.post<ResponseTransactionAPI>(CRUDOperationURL, transactionJSON, { headers: header })
                .pipe(catchError((e: any) => {

                    var exception = this.buildExceptionMessage(e, "Save");
                    throw exception;
                }));
        }
        else {

            return this.httpClient.put<ResponseTransactionAPI>(CRUDOperationURL, transactionJSON, { headers: header })
                .pipe(catchError((e: any) => {

                    var exception = this.buildExceptionMessage(e, "Save");
                    throw exception;
                }));
        }
    }

    public deleteTransaction(transactionID: number): Observable<ResponseTransactionAPI> {

        var deleteTransactionURL = this.HOST + "Transaction" + "/" + transactionID;
        var header: HttpHeaders = this.getHeader();

        return this.httpClient.delete<ResponseTransactionAPI>(deleteTransactionURL, { headers: header })
            .pipe(catchError((e: any) => {

                var exception = this.buildExceptionMessage(e, "Delete");
                throw exception;
            }));
    
    }

    public loadTransactionTypeOutlays(): Observable<Array<TypeTransactionDTO>> {

        var endPoint = "TransactionInfo/TransactionTypes";
        var requestURLParams = this.HOST + endPoint;

        return this.httpClient.get<TypeTransactionDTO[]>(requestURLParams)
                              .pipe(catchError((e: any) => {
                              
                                  var exception = this.buildExceptionMessage(e, endPoint);
                                  throw exception;
                              }));
    }

    public loadCodeListTransactions(): Observable<Array<TransactionCodeDTO>> {

        var endPoint = "TransactionInfo/TransactionCodes";
        var requestURLParams = this.HOST + endPoint;

        return this.httpClient.get<TransactionCodeDTO[]>(requestURLParams)
            .pipe(catchError((e: any) => {

                var exception = this.buildExceptionMessage(e, endPoint);
                throw exception;
            }));
    }

    public loadYearsAvailabes(): Observable<Array<number>> {

        var endPoint = "TransactionInfo/YearsAvailabes";
        var requestURLParams = this.HOST + endPoint;

        return this.httpClient.get<number[]>(requestURLParams)
                              .pipe(catchError((e: any) => {

                                  var exception = this.buildExceptionMessage(e, endPoint);
                                  throw exception;
                              }));
    }

    public deleteTransactionCode(transactionCodeID: number): Observable<any> {

        var deleteTransactionCodeURL = this.HOST + "Transaction/TransactionCode/" + transactionCodeID;
        var header: HttpHeaders = this.getHeader();

        return this.httpClient.delete<any>(deleteTransactionCodeURL, { headers: header })
            .pipe(catchError((e: any) => {

                var exception = this.buildExceptionMessage(e, "DeleteTransactionCode");
                throw exception;
            }));
    }

    public addTransactionCode(transactionCode: string):Observable<any> {

        var endPoint = this.HOST + "Transaction/TransactionCode";
        let transactionCodeJSON = this.transactionCodeToJSON(transactionCode);
        var header: HttpHeaders = this.getHeader();

        return this.httpClient.post<ResponseTransactionAPI>(endPoint, transactionCodeJSON, { headers: header })
            .pipe(catchError((e: any) => {

                var exception = this.buildExceptionMessage(e, "Add Transaction Code");
                throw exception;
            }));
    }

    public requestJWTTokenAuthorization(userLogin: string, password: string): Observable<AuthenticationToken> {

        var endPoint: string = this.HOST + "Identity/Authenticate";
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

    private buildExceptionMessage(exceptionAPI: any, endPoint: string): ExceptionAPI {

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

    private transactionToJSON(transaction: TransactionDTO): string {

        var transactionJSON: TransactionJSON = new TransactionJSON(transaction);

        return JSON.stringify(transactionJSON);
    }

    private transactionCodeToJSON(transactionCode: string): string{

        var transactionCodeJSON: TransactionCodeDTO = new TransactionCodeJSON(transactionCode);
        return JSON.stringify(transactionCodeJSON);
    }    

    private getHeader(): HttpHeaders {

        var token: string | null = sessionStorage.getItem(Constants.TOKEN_OUTLAYMANAGER_ID);
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


