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

    public synchronizeRemoteTransactions(): void {
                
        this.notificationComponent?.showLoading("Sync transactions...");

        this.outlayManagerApiService.synchronizeRemoteTransaction()                                    
                                    .subscribe(result =>
                                    {
                                        var numberOfTransactions: number = result.length;

                                        if (numberOfTransactions == 0) {

                                            this.notificationComponent?.finalizeLoading("No transactions for sync");

                                        } else {
                                            
                                            this.calendarComponent?.updateCalendarDate(null);
                                            this.notificationComponent?.finalizeLoading(`Added ${numberOfTransactions} transactions`);
                                        }

                                    }, error =>
                                    {
                                        console.log(error);
                                        this.notificationComponent?.closeLoadingModal();
                                        this.notificationComponent?.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
                                    });
    }

    public backupTransactions(): void {

        this.notificationComponent?.showLoading("Backup transactions...");

        this.outlayManagerApiService.backupTransactions()
            .subscribe(_ => {

                this.notificationComponent?.finalizeLoading("Backup successfully!");
                this.downloadBackup();

            },error => {
              
                this.notificationComponent?.closeLoadingModal();
                this.notificationComponent?.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));

            });
    }

    private downloadBackup(): void {

        this.outlayManagerApiService.downloadBackupFileTransactions()
                                    .subscribe(result => {

                                        let downloadLink = document.createElement('a');
                                        downloadLink.download = "TransactionBackup";

                                        let binaryData = [];
                                        binaryData.push(result);

                                        let blob = new Blob(binaryData, { type:"application/json" });

                                        downloadLink.href = window.URL.createObjectURL(blob);                                       
                                        downloadLink.click();

                                    }, error => {
                                                                            
                                        this.notificationComponent?.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
                                    });
    }
}