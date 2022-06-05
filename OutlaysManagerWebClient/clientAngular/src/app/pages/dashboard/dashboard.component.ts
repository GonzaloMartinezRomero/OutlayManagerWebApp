import { Component, ViewChild } from "@angular/core";
import { OutlayManagerAPI } from "../../services/outlayManagerAPI.service";
import { ExceptionUtils } from "../../utils/exceptionUtils";
import { Calendar } from "../../views/calendar/calendar.component";
import { NotificationEvent } from "../../views/notification/notification.component";

@Component(
    {
        selector: "dashboard",
        templateUrl: "dashboard.component.html"
    }
)

export class Dashboard{
        
    @ViewChild("calendar") private calendarComponent: Calendar | undefined;
    @ViewChild("notificationComponent") private notificationComponent: NotificationEvent | undefined;

    constructor(private outlayManagerApiService: OutlayManagerAPI) { }

    public downloadRemoteTransactions(): void {
                
        this.notificationComponent?.showLoading("Sync transactions...");

        this.outlayManagerApiService.downloadRemoteTransaction()                                    
                                    .subscribe(result =>
                                    {
                                        this.calendarComponent?.updateCalendarDate(null);

                                        var numberOfTransactions: number = result.length;
                                        this.notificationComponent?.finalizeLoading("Added " + numberOfTransactions+ " transactions!");

                                    }, error =>
                                    {
                                        this.notificationComponent?.finalizeLoading("Error during transaction sync");
                                        this.notificationComponent?.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
                                    });
    }
}