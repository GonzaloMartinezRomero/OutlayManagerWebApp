import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { TransactionDTO } from "../model/TransactionDTO";
import { TransacionCalendar, TransactionsCalendarContainer } from "../model/TransactionsCalendarContainer";
import { OutlayManagerAPI } from "./OutlayManagerAPI.service";


@Injectable()
export class CalendarService {

    //Se utiliza para que cuando se modifique el calendario, todos los subscriptores que usen los datos del mismo para
    //hacer algun calculo, se les llame y actualicen su contenido
    public calendarContainerSubject: Subject<TransactionsCalendarContainer> = new Subject<TransactionsCalendarContainer>();

    private weekDays: Array<string> = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
    
    private transactionsCalendar: TransactionsCalendarContainer = new TransactionsCalendarContainer();

    constructor(private outlayManagerAPI: OutlayManagerAPI) { }

    public loadTransactionsCalendar(year: number, month: number): void {

        this.outlayManagerAPI.loadTransactions(year, month)
            .subscribe(response => {
                
                var transactionsMap = new Map<number, TransactionDTO[]>();

                response.forEach(transactionAux => {

                    var day: number = new Date(transactionAux.date).getDate();

                    if (transactionsMap.has(day)) {
                        transactionsMap.get(day)?.push(transactionAux);
                    }
                    else {
                        var array = new Array<TransactionDTO>();
                        array.push(transactionAux);
                        transactionsMap.set(day, array);
                    }
                });

                this.loadCompleteCalendar(year, month, transactionsMap);

                this.calendarContainerSubject.next(this.transactionsCalendar);                
            });
    }

    private loadCompleteCalendar(year: number, month: number, transactionsMap: Map<number,TransactionDTO[]>): void
    {
        //Initialize new values
        this.transactionsCalendar.year = year;
        this.transactionsCalendar.month = month;

        this.transactionsCalendar.matrixCalendar = new Array<Array<TransacionCalendar>>();

        //Set week days
        this.transactionsCalendar.weekDays = this.weekDays;

        var dayNumber = 1;
        var daysInMonth = new Date(year, month, 0).getDate();

        var strDate = year.toString() + "/" + month.toString() + "/01";
        var initialDay = (new Date(strDate).getDay() - 1) % 7;

        var firstWeekComplete = false;

        while (dayNumber <= daysInMonth) {

            if (!firstWeekComplete)
            {
                var firstWeek = new Array<TransacionCalendar>();

                for (let i = 0; i < this.weekDays.length; i++) {
                    if (i < initialDay)
                    {
                        let transactionEmpty = new TransacionCalendar();
                        transactionEmpty.isTransactionAvailable = false;

                        firstWeek.push(transactionEmpty);
                    }
                    else
                    {
                        let transactionAvailable = new TransacionCalendar();
                        transactionAvailable.day = dayNumber;

                        if (transactionsMap.has(dayNumber)) {

                            transactionAvailable.transactionArray = transactionsMap.get(dayNumber) ?? new Array<TransactionDTO>();
                        }

                        transactionAvailable.isToday = this.isToday(year, month, dayNumber);                        

                        firstWeek.push(transactionAvailable);
                        dayNumber++;
                    }
                }

                this.transactionsCalendar.matrixCalendar.push(firstWeek);
                firstWeekComplete = true;
            }
            else
            {
                var dayNumberIndexAux = 0;
                var weekAux = new Array<TransacionCalendar>();

                while (dayNumberIndexAux < this.weekDays.length) {

                    if (dayNumber > daysInMonth)
                    {
                        let transactionEmpty = new TransacionCalendar();
                        transactionEmpty.isTransactionAvailable = false;

                        weekAux.push(transactionEmpty);
                    }
                    else
                    {
                        let transactionAvailable = new TransacionCalendar();
                        transactionAvailable.day = dayNumber;

                        if (transactionsMap.has(dayNumber)) {
                         
                            transactionAvailable.transactionArray = transactionsMap.get(dayNumber) ?? new Array<TransactionDTO>();
                        }

                        transactionAvailable.isToday = this.isToday(year, month, dayNumber);
                        weekAux.push(transactionAvailable);                        
                        dayNumber++;
                    }

                    dayNumberIndexAux++;
                }

                this.transactionsCalendar.matrixCalendar.push(weekAux);
            }
        }

    }

    private isToday(year: number, month: number, dayNumber: number): boolean {

        var today: Date = new Date(Date.now());

        return today.getFullYear() === year && today.getMonth() === (month - 1) && today.getDate() === dayNumber;
    }
     
}