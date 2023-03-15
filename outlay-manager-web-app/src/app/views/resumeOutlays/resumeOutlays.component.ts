import { Component, OnInit } from "@angular/core";
import { TransacionCalendar, TransactionsCalendarContainer } from "../../model/TransactionsCalendarContainer";
import { OutlayManagerAPI } from "../../services/outlayManagerAPI.service";
import { TransactionTypes } from "../../utils/TransactionTypes";

@Component(
    {
        selector: "resumeOutlays",
        templateUrl:"resumeOutlays.component.html"
    }
)

export class ResumeOutlays {

    public incomingView: string = "0";
    public expensesView: string = "0";
    public savingView: string = "0";
    public totalAmountView: string = "0";

    public IMG_ARROW_UP: string = "arrowUp.svg";
    public IMG_ARROW_DOWN: string = "arrowDown.svg";

    constructor(private apiService: OutlayManagerAPI) {
      
    }

    public loadMonthResume(transactionCalendarContainer: TransactionsCalendarContainer):void {

        var transactionCalendarMatrix: TransacionCalendar[][] = transactionCalendarContainer.matrixCalendar;

        var incoming:number = 0.0;
        var expenses:number = 0.0;
        var saving: number = 0.0;

        for (let week of transactionCalendarMatrix) {
            for (let transactionsDay of week) {
                for (let transactionAux of transactionsDay.transactionArray) {
                    switch (transactionAux.typeTransaction) {

                        case TransactionTypes.INCOMING:
                            incoming += transactionAux.amount;
                            break;
                        case TransactionTypes.ADJUST:
                            incoming += transactionAux.amount;
                            break;
                        case TransactionTypes.SPENDING:
                            expenses += transactionAux.amount;
                            break;
                    }
                }
            }
        }

        saving = incoming - expenses;

        this.incomingView = this.toEuroString(incoming);
        this.expensesView = this.toEuroString(expenses);
        this.savingView = this.toEuroString(saving);

        this.loadTotalAmount();

    }

    public isGreaterThanZero(amount: string): boolean {

        var valueCero: number = 0.0;
        var value: number = parseFloat(amount);

        return value > valueCero;
    }

    private loadTotalAmount() {

        var totalAmount: number = 0.0;

        this.apiService.loadAllTransactions().subscribe(values => {
            values.forEach(transactionAux => {
                switch (transactionAux.typeTransaction) {

                    case TransactionTypes.INCOMING:
                        totalAmount += transactionAux.amount;
                        break;
                    case TransactionTypes.ADJUST:
                        totalAmount += transactionAux.amount;
                        break;
                    case TransactionTypes.SPENDING:
                        totalAmount -= transactionAux.amount;
                        break;
                }
            });

            this.totalAmountView = this.toEuroString(totalAmount);
        })
    }

    private toEuroString(amount: number): string {

        var amountRounded: number = Math.round(amount * 100) / 100;
        var amountParsed: string = amountRounded.toLocaleString("de-DE");

        return amountParsed;
    }
}