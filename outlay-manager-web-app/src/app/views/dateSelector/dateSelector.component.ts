import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { DateCalendar } from "../../model/DateCalendar";
import { MessageView, VerboseType } from "../../model/MessageView";
import { OutlayManagerAPI } from "../../services/outlayManagerAPI.service";
import { ExceptionUtils } from "../../utils/exceptionUtils";
import { NotificationEvent } from "../notification/notification.component";

@Component(
    {
        selector: "date-selector",
        templateUrl:"dateSelector.component.html"
    }
)

export class DateSelector implements AfterViewInit {
       

    @ViewChild("notificationComponent") private notificationComponent: NotificationEvent | undefined;
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

    public monthsNamesReverseMap: Map<number, string> = new Map<number, string>(
        [
            [1, "January"],
            [2,"Febrary"],
            [3,"March"],
            [4,"April"],
            [5,"May"],
            [6,"Juny"],
            [7,"July"],
            [8,"Agost"],
            [9,"September"],
            [10,"October"],
            [11,"November"],
            [12,"December"],
        ]);

    public yearsAvailables: Array<number> = new Array<number>();
    public yearView: string = "";
    public monthView: string = "";

    constructor(private outlayManagerAPI: OutlayManagerAPI) { }

    ngAfterViewInit(): void {

        this.outlayManagerAPI.loadYearsAvailabes()
            .subscribe(response => {
                this.yearsAvailables = response;
                this.loadCurrentDateToView();
                this.updateCalendar();

            }, error => {
                this.notificationComponent?.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
            });
    }

    public updateCalendar():void {
        
        try
        {
            var calendarDate = this.getCalendarDate();

            this.updateDateCalendarEmitter.emit(calendarDate);
        }
        catch (exception: any) {

            var messageView = new MessageView();
            messageView.action = "Calendar Builder";
            messageView.titleError = exception.toString();
            messageView.verbose = VerboseType.Error;

            this.notificationComponent?.openModalMessage(messageView);
        }
    }

    public nextMonth():void {

        var calendarDate = this.getCalendarDate();

        if (calendarDate.Month === 12) {
            calendarDate.Month = 1;
            calendarDate.Year += 1;

        } else {
            calendarDate.Month += 1;
        }

        this.updateCalendarViewValues(calendarDate);
    }

    public backMonth(): void {

        var calendarDate = this.getCalendarDate();

        if (calendarDate.Month === 1) {
            calendarDate.Month = 12;
            calendarDate.Year -= 1;
        } else {
            calendarDate.Month -= 1;
        }

        this.updateCalendarViewValues(calendarDate);
    }

    private updateCalendarViewValues(calendarDate: DateCalendar):void {

        if (this.yearsAvailables.find(value => value === calendarDate.Year)) {

            this.yearView = calendarDate.Year.toString();
            this.monthView = this.monthsNamesReverseMap.get(calendarDate.Month) ?? "";

            this.updateDateCalendarEmitter.emit(calendarDate);
        }
    }

    private getCalendarDate(): DateCalendar{

        var yearNormalized: number = parseInt(this.yearView);
        var monthNormalized: number = this.monthsNamesMap.get(this.monthView) as number;

        if (!(yearNormalized > 1900 && (monthNormalized >= 1 && monthNormalized <= 12))) {
            throw Error("Date selected is not valid! Year: " + yearNormalized + " Month: " + monthNormalized);
        }

        var calendarDate: DateCalendar = new DateCalendar();
        calendarDate.Year = yearNormalized;
        calendarDate.Month = monthNormalized;

        return calendarDate;
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