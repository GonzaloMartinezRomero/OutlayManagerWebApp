import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { ExceptionAPI } from "../model/ExceptionAPI";
import { ResponseTransactionAPI } from "../model/ResponseTransactionAPI";
import { TransactionDTO } from "../model/TransactionDTO";

@Injectable()
export class OutlayManagerAPI {

    private HOST: string = "http://localhost:5000/";

    public listaTransacciones: Array<TransactionDTO> = new Array<TransactionDTO>();

    constructor(private httpClient: HttpClient) {

    }

    public loadAllTransactions(): Observable<TransactionDTO[]> {

        var endPoint: string = this.HOST + "Outlay/All";

        return this.httpClient.get<TransactionDTO[]>(endPoint)
            .pipe(catchError((ex: any) => {

                var exception = this.buildExceptionMessage(ex, "Get all transactions");
                throw exception;
            }));
    }

    public loadTransactions(year: number, month: number): Observable<TransactionDTO[]>
    {   
        var endPoint: string = this.HOST + "Outlay?year=" + year + "&month=" + month;

        return this.httpClient.get<TransactionDTO[]>(endPoint)
            .pipe(catchError((ex: any) => {

                var exception = this.buildExceptionMessage(ex, "Get transactions");
                throw exception;
            }));
    }

    public saveTransaction(transaction: TransactionDTO): Observable<ResponseTransactionAPI> {

        var CRUDOperationURL = this.HOST + "Outlay";
        let transactionJSON = this.transactionToJSON(transaction);
        let customHeader = { "Accept": "*/*", "Content-Type": "application/json", "Content-Encoding" : "gzip,deflate,br"};        

        if (transaction.id === 0) {

            return this.httpClient.post<ResponseTransactionAPI>(CRUDOperationURL, transactionJSON, { headers: customHeader })
                .pipe(catchError((e: any) => {

                    var exception = this.buildExceptionMessage(e, "Save");
                    throw exception;
                }));
        }
        else {

            return this.httpClient.put<ResponseTransactionAPI>(CRUDOperationURL, transactionJSON, { headers: customHeader })
                .pipe(catchError((e: any) => {

                    var exception = this.buildExceptionMessage(e, "Save");
                    throw exception;
                }));
        }
    }

    public deleteTransaction(transactionID: number): Observable<ResponseTransactionAPI> {

        var deleteTransactionURL = this.HOST + "Outlay" + "/" + transactionID;
        let customHeader = { "Accept": "*/*", "Content-Type": "application/json", "Content-Encoding": "gzip,deflate,br" };

        return this.httpClient.delete<ResponseTransactionAPI>(deleteTransactionURL, { headers: customHeader })
            .pipe(catchError((e: any) => {

                var exception = this.buildExceptionMessage(e, "Delete");
                throw exception;
            }));
    
    }

    public loadTransactionTypeOutlays():Observable<Array<string>> {

        var endPoint = "OutlayInfo/TypeOutlays";
        var requestURLParams = this.HOST + endPoint;

        return this.httpClient.get<string[]>(requestURLParams)
                              .pipe(catchError((e: any) => {
                              
                                  var exception = this.buildExceptionMessage(e, endPoint);
                                  throw exception;
                              }));
    }

    public loadCodeListTransactions(): Observable<Array<string>> {

        var endPoint = "OutlayInfo/CodeList";
        var requestURLParams = this.HOST + endPoint;

        return this.httpClient.get<string[]>(requestURLParams)
            .pipe(catchError((e: any) => {

                var exception = this.buildExceptionMessage(e, endPoint);
                throw exception;
            }));
    }

    public loadYearsAvailabes(): Observable<Array<number>> {

        var endPoint = "OutlayInfo/YearsAvailabes";
        var requestURLParams = this.HOST + endPoint;

        return this.httpClient.get<number[]>(requestURLParams)
                              .pipe(catchError((e: any) => {

                                  var exception = this.buildExceptionMessage(e, endPoint);
                                  throw exception;
                              }));
    }

    public buildExceptionMessage(exceptionAPI: any, endPoint: string): ExceptionAPI {

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

    private transactionToJSON(transaction: TransactionDTO): string {

        var transactionJSON: TransactionJSON = new TransactionJSON(transaction);

        return JSON.stringify(transactionJSON);
    }

}

class TransactionJSON {

    id: number = 0;
    amount: number = 0;
    date: string = "";
    detailTransaction: DetailTransactionJSON = new DetailTransactionJSON();
   

    constructor(transaction: TransactionDTO) {
        this.id = transaction.id;
        this.amount = transaction.amount;
        this.date = this.toLocalTime(transaction.date);
        this.detailTransaction.code = transaction.detailTransaction.code;
        this.detailTransaction.description = transaction.detailTransaction.description;
        this.detailTransaction.type = transaction.detailTransaction.type;
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

class DetailTransactionJSON {
    code: string = "";
    description: string = "";
    type: string = "";
}
