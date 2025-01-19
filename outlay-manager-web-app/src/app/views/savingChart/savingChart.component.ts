import { Component, NgZone, OnInit, ViewChild } from "@angular/core";
import { ChartConfiguration, ChartData, ChartType } from "chart.js";
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from "ng2-charts";
import { MessageView, VerboseType } from "../../model/MessageView";
import { TransactionDTO } from "../../model/TransactionDTO";
import { TransactionsCalendarContainer } from "../../model/TransactionsCalendarContainer";
import { CalendarService } from "../../services/calendar.service";
import { OutlayManagerAPI } from "../../services/outlayManagerAPI.service";
import { TransactionTypes } from "../../utils/TransactionTypes";
import { NotificationEvent } from "../notification/notification.component";
import { ResumeMonthTransaction } from "../resumeMonthTransaction/resumeMonthTransaction.component";

@Component(
    {
        selector: "savingChart",
        templateUrl:"savingChart.component.html"
    }
)

export class SavingChart implements OnInit {

    private readonly monthNames: string[] = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    @ViewChild(BaseChartDirective) private chart: BaseChartDirective | undefined;
    @ViewChild("expenses") private resumeMonthExpensesComponent: ResumeMonthTransaction | undefined;
    @ViewChild("incomings") private resumeMonthIncomingComponent: ResumeMonthTransaction | undefined;
    @ViewChild("notificationComponent") private notificationComponent: NotificationEvent | undefined;

    public yearSelected: number = 0;
    public yearsAvailables: Array<number> = new Array<number>();

    constructor(private outlayAPIService: OutlayManagerAPI, private calendarService: CalendarService, private angularZone: NgZone) {

        this.calendarService.calendarContainerSubject.subscribe(response => { this.updateResumeMonthTransactions(response);});
    }

    ngOnInit(): void {

        this.outlayAPIService.loadYearsAvailabes()
            .subscribe(response => {
                this.yearsAvailables = response;

            }, error => {

                this.notificationComponent?.openModalMessage(this.buildMessageError(error, "Load Years Availables"));
            });
    }

    public barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        // We use these empty structures as placeholders for dynamic theming.
        scales: {
            x: {
               
            },
            y: {
                
            }
        },
        plugins: {
            legend: {
                display: true,
            },
            datalabels: {
                anchor: 'end',
                align: 'end'
            }
        },
        //onClick: (clickEvt, ActiveElements) => this.onChartClick(clickEvt, ActiveElements)
    };
    public barChartType: ChartType = 'bar';

    public barChartPlugins = [
        DataLabelsPlugin
    ];

    public savingChartPerMonthData: ChartData<'bar'> = {
        labels: this.monthNames,
        datasets: []
     };


    public updateTransactionsResume(response: any) {

        if (response.active.length === 1) {

            var indexDataSet: number = response.active[0].datasetIndex;
            var year = this.savingChartPerMonthData.datasets[indexDataSet].label;
            var month: number = response.active[0].index;

            var yearParsed: number = Number.parseInt(year ?? "0");
            var monthParsed: number = month + 1;

            //Como el tema del grafico va por fuera de angular, los cambios no los pilla el componente
            //Para que lo haga te tienes que meter en el hilo de ejecuion de angular desde el chart-event
            this.angularZone.run(() => { this.calendarService.loadTransactionsCalendar(yearParsed, monthParsed); });
        }
    }

    public updateResumeMonthTransactions(calendarContainer: TransactionsCalendarContainer) {
        
        this.resumeMonthExpensesComponent?.loadTransactionsResume(calendarContainer.year, calendarContainer.month, true);
        this.resumeMonthIncomingComponent?.loadTransactionsResume(calendarContainer.year, calendarContainer.month, false);
    }

    public clearChart(): void {
        this.savingChartPerMonthData.datasets = [];
        this.chart?.update();
    }

    public addYearOutlaysSavings(): void {

        this.outlayAPIService.loadTransactionsYear(this.yearSelected).subscribe(response => {

            var dataMap: Map<string, number> = new Map<string, number>();

            var allTransactions: Array<TransactionDTO> = allTransactions = response;

            allTransactions.forEach(value => {
                var key: string = this.generateDateKey(value);
                var amount: number = this.getAmountSaved(value);

                if (dataMap.has(key)) {

                    var totalAmount: number = dataMap.get(key) ?? 0;
                    totalAmount += amount;
                    totalAmount = Math.round(totalAmount * 100) / 100

                    dataMap.set(key, totalAmount);

                } else {
                    dataMap.set(key, amount);
                }
            })

            var values: Array<number> = new Array<number>();

            this.monthNames.forEach(x => {
                if (dataMap.has(x)) {
                    values.push(dataMap.get(x) ?? 0);
                }
                else {
                    values.push(0);
                }
            });

            this.savingChartPerMonthData.datasets.push({ data: values, label: this.yearSelected.toString() });
            this.chart?.update();
        });
    }

    private generateDateKey(transactionDTO: TransactionDTO): string {

        var date: Date = new Date(transactionDTO.date);

        var month: string = this.monthNames[date.getMonth()];

        return month;
    }

    private getAmountSaved(transactionDTO: TransactionDTO): number {

        var saving: number = 0;

        if (transactionDTO.typeTransaction == TransactionTypes.SPENDING) {

            saving = transactionDTO.amount * -1;

        } else {

            saving = transactionDTO.amount;
        }

        return saving;
    }

    private buildMessageError(error: any, action: string): MessageView {

        var messageView = new MessageView();

        messageView.action = action;
        messageView.titleError = error.Message;
        messageView.detail = "";
        messageView.statusCode = error.StatusCode;
        messageView.verbose = VerboseType.Error;

        return messageView;
    }
}
