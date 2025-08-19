import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { AmountResume } from "../model/AmountResume";
import { ExceptionAPI } from "../model/ExceptionAPI";
import { ResponseTransactionAPI } from "../model/ResponseTransactionAPI";
import { TransactionCodeDTO } from "../model/TransactionCodeDTO";
import { TransactionDTO } from "../model/TransactionDTO";
import { TypeTransactionDTO } from "../model/TypeTransactionDTO";
import { SavingPerYearDto } from "../model/SavingPerYearDto";

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

  public savingsPerYear(): Observable<SavingPerYearDto[]> {

    var endPoint = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.TransactionsInfo.SavingPerYear;

    return this.httpClient.get<SavingPerYearDto[]>(endPoint)
      .pipe(catchError((e: any) => {

        var exception = this.buildExceptionMessage(e, endPoint);
        throw exception;
      }));
  }

    //Returns transactions saved asynchronously
    public getPendingTransactions(): Observable<TransactionDTO[]> {

        var endPoint: string = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.PendingTransactionEndpoint;

        var header: HttpHeaders = this.getHeader();

        return this.httpClient.post<TransactionDTO[]>(endPoint,"", { headers: header })
            .pipe(catchError((ex: any) => {

                var exception = this.buildExceptionMessage(ex, "Sync remote transactions");
                throw exception;
            }));
    }

    public downloadAllTransactions(): Observable<Blob> {

      var endPoint: string = environment.hostOutlayManagerAPI + environment.outlayManagerAPIEndpoints.Transactions + '/DownloadAll';

      var header: HttpHeaders = this.getHeader();

      return this.httpClient.get(endPoint, { headers: header, responseType:'blob' })
        .pipe(catchError((ex: any) => {

          var exception = this.buildExceptionMessage(ex, "Download all transactions");
          throw exception;
        }));
    }

    private buildExceptionMessage(exceptionAPI: any, endPoint: string): ExceptionAPI {

        console.log("Exception api");
        console.log(exceptionAPI);

        var exceptionErrorAPI: any = exceptionAPI.error;

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

    private transactionToJSON(transaction: TransactionDTO): string {

        var transactionJSON: TransactionJSON = new TransactionJSON(transaction);

        return JSON.stringify(transactionJSON);
    }

    private transactionCodeToJSON(transactionCode: string): string{

        var transactionCodeJSON: TransactionCodeDTO = new TransactionCodeJSON(transactionCode);
        return JSON.stringify(transactionCodeJSON);
    }    

    private getHeader(): HttpHeaders {
  
        var httpHeader: HttpHeaders = new HttpHeaders({ "Accept": "*/*", "Content-Type": "application/json", "Content-Encoding": "gzip,deflate,br" });

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
