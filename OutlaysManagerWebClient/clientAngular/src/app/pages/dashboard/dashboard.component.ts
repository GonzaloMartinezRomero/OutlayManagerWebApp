import { Component, ElementRef, ViewChild } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { OutlayManagerAPI } from "../../services/outlayManagerAPI.service";
import { Calendar } from "../../views/calendar/calendar.component";

@Component(
    {
        selector: "dashboard",
        templateUrl: "dashboard.component.html"
    }
)

export class Dashboard{

    @ViewChild('loadingComponent') mymodal: ElementRef | undefined;
    public updatedTransactions: string = "Ninguna";
    public loadingModal?: NgbModalRef | undefined;
    @ViewChild("calendar") calendarComponent: Calendar | undefined;

    constructor(private outlayManagerApiService: OutlayManagerAPI, private modalABM: NgbModal) {

    }

    public downloadRemoteTransactions():void {

        console.log("Dandolo a la vaina");

        this.loadingModal = this.modalABM.open(this.mymodal);

        console.log(this.loadingModal);

        this.outlayManagerApiService.downloadRemoteTransaction().subscribe(result =>
        {
            this.calendarComponent?.updateCalendarDate(null);

            this.updatedTransactions = "pues ya esta";            
        });
    }

    public confirm(): void{
        this.loadingModal?.close();
    }
}