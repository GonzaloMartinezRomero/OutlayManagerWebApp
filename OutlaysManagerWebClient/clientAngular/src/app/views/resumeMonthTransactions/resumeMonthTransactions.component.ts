import { Component } from "@angular/core";
import { ResumeMonthTransacion } from "../../model/ResumeMonthTransaction";
import { TransactionDTO } from "../../model/TransactionDTO";
import { TransacionCalendar } from "../../model/TransactionsCalendarContainer";
import { TransactionTypes } from "../../model/TransactionTypes";
import { CalendarService } from "../../services/calendar.service";

@Component(
    {
        selector: "resumeMonthTransactions",
        templateUrl: "resumeMonthTransactions.component.html",
        styleUrls:["TransactionTableStyle.css"]
    }
)

export class ResumeMonthTransactions{

    public spendingsTransactions: Array<ResumeMonthTransacion> = new Array<ResumeMonthTransacion>();
    public incomingTransactions: Array<ResumeMonthTransacion> = new Array<ResumeMonthTransacion>();

    constructor(private calendarService: CalendarService) {

        calendarService.matrixCalendarSubject.subscribe((transactionsCalendar => {
            this.loadResumeTransactions(transactionsCalendar);
        }));
    }   

    private loadResumeTransactions(transactionCalendarArray: TransacionCalendar[][]): void {

        var spendingsTransactionsMapAux: Map<string,ResumeMonthTransacion> = new Map<string,ResumeMonthTransacion>();
        var incomingsransactionsMapAux: Map<string,ResumeMonthTransacion> = new Map<string,ResumeMonthTransacion>();

        transactionCalendarArray.forEach(week => {
            week.forEach(day => {
                day.transactionArray.forEach(transactionAux => {

                    if (transactionAux.typeTransaction == TransactionTypes.SPENDING) {

                        this.aggregateValue(spendingsTransactionsMapAux, transactionAux)

                    } else {

                        this.aggregateValue(incomingsransactionsMapAux, transactionAux)
                    }
                });
            });
        });

        this.spendingsTransactions = [...spendingsTransactionsMapAux.values()].sort(this.comparatorTransactionMapValue);
        this.incomingTransactions = [...incomingsransactionsMapAux.values()].sort(this.comparatorTransactionMapValue);        
    }

    private aggregateValue(collectionMap: Map<string, ResumeMonthTransacion>, transaction: TransactionDTO): void {

        var trCode: string = transaction.codeTransaction;

        if (collectionMap.has(trCode)) {

            var totalAmount: number = (collectionMap?.get(trCode)?.amount ?? 0) + transaction.amount;
            totalAmount = Math.round(totalAmount * 100) / 100;

            var updatedTransaction: ResumeMonthTransacion = new ResumeMonthTransacion();
            updatedTransaction.code = trCode;
            updatedTransaction.amount = totalAmount;

            collectionMap.set(trCode, updatedTransaction);
        }
        else {
            var newTransaction: ResumeMonthTransacion = new ResumeMonthTransacion();
            newTransaction.code = trCode;
            newTransaction.amount = transaction.amount;
            
            collectionMap.set(trCode, newTransaction);
        }
    }

    private comparatorTransactionMapValue(a: ResumeMonthTransacion, b: ResumeMonthTransacion): number {

        return (a.amount - b.amount) * -1;
    }
}