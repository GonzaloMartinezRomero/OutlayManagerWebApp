import { Component, ViewChild } from "@angular/core";
import { ChartConfiguration, ChartData, ChartType } from "chart.js";
import { BaseChartDirective } from "ng2-charts";
import { TransactionDTO } from "../../model/TransactionDTO";
import { OutlayManagerAPI } from "../../services/outlayManagerAPI.service";
import { TransactionTypes } from "../../utils/TransactionTypes";

@Component(
    {
        selector: "resumeMonthTransaction",
        templateUrl: "resumeMonthTransaction.component.html"
    }
)

export class ResumeMonthTransaction{

    @ViewChild(BaseChartDirective) chartExpenses: BaseChartDirective | undefined;    

    constructor(private apiService: OutlayManagerAPI) { }

    public pieChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio:false,
        plugins: {
            legend: {
                display: true,
            },
        },       
    };

    public pieChartData: ChartData<'pie', number[], string > = {
        labels: [],
        datasets: [{
            data: []
        }]        

    };

    public pieChartType: ChartType = 'pie';

    public loadTransactionsResume(year:number, month:number, loadExpenses:boolean): void {

        var transactionsMap: Map<string, number> = new Map<string, number>();

        this.apiService.loadTransactions(year, month)
            .subscribe(transactions =>
            {
                transactions.forEach(transactionAux =>
                {
                    switch (transactionAux.typeTransaction) {

                        case TransactionTypes.SPENDING:
                            if (loadExpenses) 
                                this.agregateTransactionAmount(transactionsMap, transactionAux);

                            break;

                        default:
                            if (!loadExpenses) 
                                this.agregateTransactionAmount(transactionsMap, transactionAux);
                            break;
                    }                    
                })

                this.updateSpendingChart(transactionsMap);

            });
    }

    private updateSpendingChart(spendingsTransactions: Map<string, number>  ):void {

        this.pieChartData.labels = [];
        this.pieChartData.datasets[0].data = [];

        spendingsTransactions.forEach((value, key) => {

            this.pieChartData.labels?.push(key);
            this.pieChartData.datasets[0].data.push(value);

        });

        this.chartExpenses?.update();
    }


    private agregateTransactionAmount(transactinonsMap: Map<string, number>, transaction: TransactionDTO): void {

        var trCode: string = transaction.codeTransaction;

        if (transactinonsMap.has(trCode)) {

            var totalAmount: number = (transactinonsMap?.get(trCode) ?? 0) + transaction.amount;
            totalAmount = Math.round(totalAmount * 100) / 100;

            transactinonsMap.set(trCode, totalAmount);
        }
        else {

            transactinonsMap.set(trCode, transaction.amount);
        }
    }

}


