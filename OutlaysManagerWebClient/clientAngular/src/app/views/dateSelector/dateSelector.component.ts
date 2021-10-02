import { Component, OnInit } from "@angular/core";
import { toInteger } from "@ng-bootstrap/ng-bootstrap/util/util";
import { AppComponent } from "../../app.component";
import { MessageView, VerboseType } from "../../model/MessageView";
import { CalendarService } from "../../services/calendar.service";
import { OutlayManagerAPI } from "../../services/OutlayManagerAPI.service";

@Component(
    {
        selector: "date-selector",
        templateUrl:"dateSelector.component.html"
    }
)

export class DateSelector implements OnInit {

    public monthsNamesMap: Map<string, number> = new Map<string, number>(
        [
            ["Enero", 1],
            ["Febrero", 2],
            ["Marzo", 3],
            ["Abril", 4],
            ["Mayo", 5],
            ["Junio", 6],
            ["Julio", 7],
            ["Agosto", 8],
            ["Septiembre", 9],
            ["Octubre", 10],
            ["Noviembre", 11],
            ["Diciembre", 12],
        ]);

    public yearsAvailables: Array<number> = new Array<number>();
    public yearView: string = "";
    public monthView: string = "";

    constructor(public calendarService: CalendarService, private outlayManagerAPI: OutlayManagerAPI, private mainApp: AppComponent) {
       
    }

    ngOnInit(): void {

        this.outlayManagerAPI.loadYearsAvailabes()
            .subscribe(response =>
            {
                this.yearsAvailables = response;
                this.loadCurrentDateToView();

            }, error => {
                this.mainApp.openModalMessage(this.buildMessageErrorFromAPIError(error, "Load Years Availables"));
            });       
    }

    public updateCalendar():void {
        
        try
        {
            var yearNormalized: number = parseInt(this.yearView);
            var monthNormalized: number = this.monthsNamesMap.get(this.monthView) as number;

            if (!(yearNormalized > 1900 && (monthNormalized >= 1 && monthNormalized <= 12))) {
                throw Error("Date selected is not valid! Year: " + yearNormalized + " Month: " + monthNormalized);
            }

            this.calendarService.loadTransactionsCalendar(yearNormalized, monthNormalized);
        }
        catch (exception: any) {

            var messageView = new MessageView();
            messageView.action = "Calendar Builder";
            messageView.titleError = exception.toString();
            messageView.verbose = VerboseType.Error;

            this.mainApp.openModalMessage(messageView);
        }
    }

    private buildMessageErrorFromAPIError(error:any, action:string): MessageView {

        var messageView = new MessageView();

        messageView.action = action;
        messageView.titleError = error.Message;
        messageView.detail = "";
        messageView.statusCode = error.StatusCode;
        messageView.verbose = VerboseType.Error;

        return messageView;
    }

    private loadCurrentDateToView() {

        var today: Date = new Date(Date.now());

        var currentYear: number = today.getFullYear();

        if (!this.yearsAvailables.find(value => value === currentYear)) {
            this.yearsAvailables.push(currentYear);
        }

        this.yearView = currentYear.toString();
        
        var currentMonth = today.getMonth() + 1;
        this.monthsNamesMap.forEach((value, key) =>
        {
            if (value === currentMonth) {
                this.monthView = key;                
            }   
        });
    }
}