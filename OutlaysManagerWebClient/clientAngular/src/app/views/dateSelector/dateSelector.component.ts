import { AfterViewInit, Component, EventEmitter, Output } from "@angular/core";
import { AppComponent } from "../../app.component";
import { DateCalendar } from "../../model/DateCalendar";
import { MessageView, VerboseType } from "../../model/MessageView";
import { OutlayManagerAPI } from "../../services/outlayManagerAPI.service";
import { ExceptionUtils } from "../../utils/exceptionUtils";

@Component(
    {
        selector: "date-selector",
        templateUrl:"dateSelector.component.html"
    }
)

export class DateSelector implements AfterViewInit {

    @Output() updateDateCalendarEmitter: EventEmitter<DateCalendar> = new EventEmitter<DateCalendar>();

    public monthsNamesMap: Map<string, number> = new Map<string, number>(
        [
            ["January", 1],
            ["Febrary", 2],
            ["March", 3],
            ["April", 4],
            ["May", 5],
            ["Juny", 6],
            ["July", 7],
            ["Agost", 8],
            ["September", 9],
            ["October", 10],
            ["November", 11],
            ["December", 12],
        ]);

    public yearsAvailables: Array<number> = new Array<number>();
    public yearView: string = "";
    public monthView: string = "";

    constructor(private outlayManagerAPI: OutlayManagerAPI, private mainApp: AppComponent) {
       
    }

    ngAfterViewInit(): void {

        this.outlayManagerAPI.loadYearsAvailabes()
            .subscribe(response => {
                this.yearsAvailables = response;
                this.loadCurrentDateToView();
                this.updateCalendar();

            }, error => {
                this.mainApp.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
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

            var calendarDate: DateCalendar = new DateCalendar();
            calendarDate.Year = yearNormalized;
            calendarDate.Month = monthNormalized;

            this.updateDateCalendarEmitter.emit(calendarDate);
        }
        catch (exception: any) {

            var messageView = new MessageView();
            messageView.action = "Calendar Builder";
            messageView.titleError = exception.toString();
            messageView.verbose = VerboseType.Error;

            this.mainApp.openModalMessage(messageView);
        }
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