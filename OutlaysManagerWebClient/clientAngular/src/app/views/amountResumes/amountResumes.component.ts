import { Component, OnInit, ViewChild } from "@angular/core";
import { ChartConfiguration, ChartType } from "chart.js";
import { BaseChartDirective } from "ng2-charts";
import { AmountResume } from "../../model/AmountResume";
import { OutlayManagerAPI } from "../../services/outlayManagerAPI.service";

@Component(
    {
        selector: "amountResumes",
        templateUrl:"amountResumes.component.html"
    }
)

export class AmountResumes implements OnInit {

    @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

    public lineChartType: ChartType = 'line';
    public resumeAmountArray: Array<AmountResume> = new Array<AmountResume>();

    public lineChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        // We use these empty structures as placeholders for dynamic theming.
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
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
    };

    private dateLabels: Array<string> = new Array<string>();
    private amountDataSet: Array<number> = new Array<number>();

    constructor(private outlayAPIService: OutlayManagerAPI) { }

    ngOnInit(): void {

        this.outlayAPIService.loadAmountResumes()
            .subscribe(values => {       
               
                this.resumeAmountArray = values;

                this.resumeAmountArray.forEach(value => {
                    this.dateLabels.push(this.buildKeyLabel(value));
                    this.amountDataSet.push(value.amount);
                });

                this.chart?.update();
            });
    }

    public lineChartData: ChartConfiguration['data'] = {
        datasets: [
            {
                data: this.amountDataSet,
                label:"Total Amount",
                backgroundColor: 'rgba(148,159,177,0.2)',
                borderColor: 'rgba(148,159,177,1)',
                pointBackgroundColor: 'rgba(148,159,177,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148,159,177,0.8)',
            }],

        labels: this.dateLabels
    }

    private buildKeyLabel(amountResume: AmountResume): string{

        var year: string = amountResume.year.toString();
        var month: string = amountResume.month.toString();

        return year + "_" + month;
    }

}