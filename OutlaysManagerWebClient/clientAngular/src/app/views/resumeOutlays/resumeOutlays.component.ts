import { Component, Injectable, OnInit } from "@angular/core";
import { createVoidZero } from "typescript";
import { Type } from "../../model/TransactionDTO";
import { TransacionCalendar, TransactionsCalendarContainer } from "../../model/TransactionsCalendarContainer";
import { CalendarService } from "../../services/calendar.service";
import { OutlayManagerAPI } from "../../services/OutlayManagerAPI.service";

@Component(
    {
        selector: "resumeOutlays",
        templateUrl:"resumeOutlays.component.html"
    }
)

export class ResumeOutlays implements OnInit {

    public incomingView: string = "0";
    public expensesView: string = "0";
    public savingView: string = "0";
    public totalAmountView: string = "0";

    public PATH_ARROW_UP: string = "clientAngular/assets/img/arrowUp.svg";
    public PATH_ARROW_DOWN: string = "clientAngular/assets/img/arrowDown.svg";

    constructor(private calendarService: CalendarService, private apiService: OutlayManagerAPI) {

        this.calendarService.matrixCalendarSubject.subscribe((transactionCalendarMatrix) => {
            this.loadResume(transactionCalendarMatrix);
            this.loadTotalAmount();
        });
    }

    ngOnInit(): void {
        this.loadTotalAmount();
    }

    public loadResume(transactionCalendarMatrix: TransacionCalendar[][]):void {

        var incoming:number = 0.0;
        var expenses:number = 0.0;
        var saving: number = 0.0;

        for (let week of transactionCalendarMatrix) {
            for (let transactionsDay of week) {
                for (let transactionAux of transactionsDay.transactionArray) {
                    switch (transactionAux.detailTransaction.type) {

                        case Type.Incoming:
                            incoming += transactionAux.amount;
                            break;
                        case Type.Adjust:
                            incoming += transactionAux.amount;
                            break;
                        case Type.Spending:
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
                switch (transactionAux.detailTransaction.type) {

                    case Type.Incoming:
                        totalAmount += transactionAux.amount;
                        break;
                    case Type.Adjust:
                        totalAmount += transactionAux.amount;
                        break;
                    case Type.Spending:
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