import { Component, ViewChild } from "@angular/core";
import { ChartConfiguration, ChartData, ChartType } from "chart.js";
import { BaseChartDirective } from "ng2-charts";
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { OutlayManagerAPI } from "../../services/OutlayManagerAPI.service";
import { TransactionDTO } from "../../model/TransactionDTO";
import * as _ from 'lodash';
import { forEach } from "lodash";
import { TransactionTypes } from "../../model/TransactionTypes";
import { OnInit } from "@angular/core";

///BORRAR LA PUTA MIERDA DE LODASH -> NO PILLA BIEN LOS TIPOS Y NO COMPILA


@Component(
    {
        selector: "analycer",
        templateUrl: "analycer.component.html"
    }
)

export class Analycer implements OnInit {

    @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

    public dataMap: Map<string, number> = new Map<string, number>();

    constructor(private outlayAPIService: OutlayManagerAPI) {
        this.loadSavings();
    }
    ngOnInit(): void {
        this.loadSavings();
    }

    public barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        // We use these empty structures as placeholders for dynamic theming.
        scales: {
            x: {

            },
            y: {
                min: 10
            }
        },
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                anchor: 'end',
                align: 'end'
            }
        }
    };
    public barChartType: ChartType = 'bar';

    public barChartPlugins = [
        DataLabelsPlugin
    ];

    public barChartData(): ChartData<'bar'>
    {
        var keys = Array.from(this.dataMap.keys());
        var values = Array.from(this.dataMap.values(), x => Math.round(x * 100) / 100);

        var array = {
            labels: keys,
            datasets: [
                { data: values, label: 'Savings' }
            ]
        };

        return array;
    } 

    private loadSavings():void {

        this.outlayAPIService.loadAllTransactions().subscribe(response => {

            this.dataMap = new Map<string, number>();

            var allTransactions: Array<TransactionDTO> = allTransactions = response;

            allTransactions.forEach(value =>
            {
                var key: string = this.generateDateKey(value);
                var amount: number = this.getAmountSaved(value);

                if (this.dataMap.has(key)) {

                    var totalAmount: number = this.dataMap.get(key) ?? 0;
                    totalAmount += amount;

                    this. dataMap.set(key, totalAmount);

                } else {
                    this.dataMap.set(key, amount);
                }
            })
        });
    }

    private generateDateKey(transactionDTO: TransactionDTO): string {

        var date: Date = new Date(transactionDTO.date);

        var year: string = date.getFullYear().toString();
        var month: string = (date.getMonth() + 1).toString();

        return year + "_" + month;
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
  
}