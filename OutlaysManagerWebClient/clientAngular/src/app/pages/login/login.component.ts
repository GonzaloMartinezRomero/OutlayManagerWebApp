import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AppComponent } from "../../app.component";
import { MessageView, VerboseType } from "../../model/MessageView";
import { OutlayManagerAPI } from "../../services/outlayManagerAPI.service";
import { Constants } from "../../utils/constants";
import { ExceptionUtils } from "../../utils/exceptionUtils";

@Component(
    {
        selector: "login",
        templateUrl: "login.component.html"
    }
)

export class Login{

    public userLogin: string = "";
    public userPassword: string = "";

    constructor(private outlayManagerAPI: OutlayManagerAPI, private mainApp: AppComponent, private router: Router) {

    }

    public login() {

        this.outlayManagerAPI.requestJWTTokenAuthorization(this.userLogin, this.userPassword)
            .subscribe(response =>
            {

                if (response.credentialToken === undefined || response.credentialToken === "") {

                    this.mainApp.openModalMessage(this.buildMsgErrorLogin());

                } else {

                    try
                    {
                        sessionStorage.setItem(Constants.TOKEN_OUTLAYMANAGER_ID, response.credentialToken);
                        this.router.navigateByUrl('Dashboard');

                    } catch (exception){

                        this.mainApp.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(exception));
                    }         
                }

            }, error => {
                               
                this.mainApp.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
            });
    }

    private buildMsgErrorLogin(): MessageView {

        let msg = new MessageView();
        msg.action = "Login";
        msg.detail = "Login error";
        msg.statusCode = "401";
        msg.titleError = "Login Error";
        msg.verbose = VerboseType.Error;

        return msg;
    }
}