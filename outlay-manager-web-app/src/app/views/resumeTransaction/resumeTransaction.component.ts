import { Component, OnInit, ViewChild } from "@angular/core";
import { ChartConfiguration, ChartData, ChartType } from "chart.js";
import { BaseChartDirective } from "ng2-charts";
import { MessageView, VerboseType } from "../../model/MessageView";
import { OutlayManagerAPI } from "../../services/outlayManagerAPI.service";
import { NotificationEvent } from "../notification/notification.component";

@Component(
    {
       selector: "resumeTransaction",
       templateUrl:"resumeTransaction.component.html"
    }
)

export class ResumeTransaction implements OnInit {

    @ViewChild(BaseChartDirective) private chart: BaseChartDirective | undefined;
    @ViewChild("notificationComponent") private notificationComponent: NotificationEvent | undefined;

    public yearsAvailables: Array<number> = new Array<number>();
    public yearSelected: number = 0;

    constructor(private outlayAPIService: OutlayManagerAPI) { }

    ngOnInit(): void {

        this.outlayAPIService.loadYearsAvailabes()
            .subscribe(response => {
                this.yearsAvailables = response;
                this.yearSelected = this.yearsAvailables[this.yearsAvailables.length - 1];
                this.loadTransactionChart(this.yearSelected);

            }, error => {

                this.notificationComponent?.openModalMessage(this.buildMessageError(error, "Load Years Availables"));
            });

    }

    public barChartOptions: ChartConfiguration['options'] = {
        scales: {
            x: {
             stacked:true
            },
            y: {
            stacked:true
            }
        },
        indexAxis:'y',
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'end'
          },
          legend:{
            display:false
          }
      }
    };
    public barChartType: ChartType = 'bar';

    public barChartData: ChartData<'bar'> = {
        labels: [],
        datasets: []
  };


  public loadTransactionChart(year:any){
 
      this.outlayAPIService.resumeTransactions(this.yearSelected)
                        .subscribe(
                          response => {
                            
                            this.barChartData.datasets = [];
                            this.barChartData.labels = response.map(x => x.code);
                            this.barChartData.datasets.push({ data: response.map(x => x.expenses), label: 'Expenses', backgroundColor:'#df2b2bff' });
                            this.barChartData.datasets.push({ data: response.map(x => x.incoming), label: 'Incomings', backgroundColor:'#5cd42cff' })
                            this.chart?.update();
                          },
                          error => {
                              this.notificationComponent?.openModalMessage(this.buildMessageError(error, ""));
                          });
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
