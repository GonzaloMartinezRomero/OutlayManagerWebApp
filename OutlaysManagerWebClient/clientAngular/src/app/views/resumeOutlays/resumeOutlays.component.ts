import { Component, Injectable, OnInit } from "@angular/core";
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

    private readonly DEC_NUMBER: number = 2;

    constructor(private calendarService: CalendarService, private apiService: OutlayManagerAPI) {

        this.calendarService.matrixCalendarSubject.subscribe((transactionCalendarMatrix) => {
            this.loadResume(transactionCalendarMatrix)
        });
    }

    ngOnInit(): void {
        this.loadTotalAmount();
    }

    public loadResume(transactionCalendarMatrix: TransacionCalendar[][]):void {

        var incoming:number = 0;
        var expenses:number = 0;
        var saving: number = 0;

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

        this.incomingView = Math.round(incoming).toFixed(this.DEC_NUMBER);
        this.expensesView = Math.round(expenses).toFixed(this.DEC_NUMBER);
        this.savingView = Math.round(saving).toFixed(this.DEC_NUMBER);

        this.loadTotalAmount();      
    }

    private loadTotalAmount() {

        var totalAmount: number = 0;

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

            this.totalAmountView = Math.round(totalAmount).toFixed(this.DEC_NUMBER);
        })

    }

}