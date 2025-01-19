import { Component, OnInit, ViewChild } from "@angular/core";
import { ChartConfiguration, ChartData, ChartType } from "chart.js";
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from "ng2-charts";
import { MessageView, VerboseType } from "../../model/MessageView";
import { OutlayManagerAPI } from "../../services/outlayManagerAPI.service";
import { NotificationEvent } from "../notification/notification.component";

@Component(
    {
        selector: "savingChartPerYear",
       templateUrl:"savingChartPerYear.component.html"
    }
)

export class SavingChartPerYear implements OnInit {

    @ViewChild(BaseChartDirective) private chart: BaseChartDirective | undefined;
    @ViewChild("notificationComponent") private notificationComponent: NotificationEvent | undefined;

    constructor(private outlayAPIService: OutlayManagerAPI) { }

    ngOnInit(): void {

        this.outlayAPIService.savingsPerYear()
          .subscribe(
            response => {
              
              this.barChartData.labels = response.map(x => x.year);
              this.barChartData.datasets.push({ data: response.map(x => x.savings), label: 'Savings', backgroundColor:'#8594ed' })
              this.chart?.update();
            },
            error => {
                this.notificationComponent?.openModalMessage(this.buildMessageError(error, ""));
            });
    }

    public barChartOptions: ChartConfiguration['options'] = {
        scales: {
            x: {
            
            },
            y: {
            
            }
        },
        plugins: {
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

    public barChartData: ChartData<'bar'> = {
        labels: [],
        datasets: []
  };

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
