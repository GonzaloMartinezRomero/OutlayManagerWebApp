import { Component, OnInit } from "@angular/core";
import { OutlayManagerAPI } from "../../services/outlayManagerAPI.service";

@Component(
    {
        selector: "resumeOutlays",
        templateUrl:"resumeOutlays.component.html"
    }
)

export class ResumeOutlays{

    public incomingView: string = "0";
    public expensesView: string = "0";
    public savingView: string = "0";
    public totalAmountView: string = "0";
    public roi: string = "0";
   
    public IMG_ARROW_UP: string = "arrowUp.svg";
    public IMG_ARROW_DOWN: string = "arrowDown.svg";

    constructor(private apiService: OutlayManagerAPI) {}

    public loadMonthResume(year:number, month:number):void {

       this.apiService.getMonthResume(year,month).subscribe(x=>{

        this.incomingView = this.toEuroString(x.incomings);
        this.expensesView = this.toEuroString(x.expenses);
        this.savingView = this.toEuroString(x.savings);
       }
       );

        this.apiService.getTotalAmount().subscribe(x=>{
            this.totalAmountView = this.toEuroString(x.amount);
       }
       );

        this.apiService.getRoi().subscribe(x=>{
            this.roi = this.toEuroString(x.amount);
       }
       );
    }

    public isGreaterThanZero(amount: string): boolean {

        var valueCero: number = 0.0;
        var value: number = parseFloat(amount);

        return value > valueCero;
    }

    private toEuroString(amount: number): string {

        var amountRounded: number = Math.round(amount * 100) / 100;
        var amountParsed: string = amountRounded.toLocaleString("de-DE");

        return amountParsed;
    }
}