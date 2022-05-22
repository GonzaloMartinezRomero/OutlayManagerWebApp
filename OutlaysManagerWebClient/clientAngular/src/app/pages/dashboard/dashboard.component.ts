import { Component } from "@angular/core";
import { AppComponent } from "../../app.component";
import { MessageView } from "../../model/MessageView";
import { TransactionDTO } from "../../model/TransactionDTO";
import { OutlayManagerAPI } from "../../services/outlayManagerAPI.service";

@Component(
    {
        selector: "dashboard",
        templateUrl: "dashboard.component.html"
    }
)

export class Dashboard{

    constructor(private outlayManagerApiService: OutlayManagerAPI, private mainApp: AppComponent ) {

    }

    public downloadRemoteTransactions():void {
        //Mejor meter este servicio dentro del calendar component para poder recargarlo al tener los datos
        this.outlayManagerApiService.downloadRemoteTransaction().subscribe(result =>
        {
            var messageView: MessageView = new MessageView();

            messageView.detail = "Added " + result.length + " transactions";

            this.mainApp.openModalMessage(messageView);
        });
    }
}