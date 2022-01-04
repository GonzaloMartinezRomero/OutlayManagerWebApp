import { __decorate } from "tslib";
import { Component } from "@angular/core";
import { MessageView, VerboseType } from "../../model/MessageView";
import { Constants } from "../../utils/constants";
import { ExceptionUtils } from "../../utils/exceptionUtils";
let Login = class Login {
    constructor(outlayManagerAPI, mainApp, router) {
        this.outlayManagerAPI = outlayManagerAPI;
        this.mainApp = mainApp;
        this.router = router;
        this.userLogin = "";
        this.userPassword = "";
    }
    login() {
        this.outlayManagerAPI.requestJWTTokenAuthorization(this.userLogin, this.userPassword)
            .subscribe(response => {
            console.log("RESPONSE");
            console.log(response);
            if (response.credentialToken === undefined || response.credentialToken === "") {
                this.mainApp.openModalMessage(this.buildMsgErrorLogin());
            }
            else {
                try {
                    sessionStorage.setItem(Constants.TOKEN_OUTLAYMANAGER_ID, response.credentialToken);
                    this.router.navigateByUrl('Dashboard');
                }
                catch (exception) {
                    this.mainApp.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(exception));
                }
            }
        }, error => {
            this.mainApp.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
        });
    }
    buildMsgErrorLogin() {
        let msg = new MessageView();
        msg.action = "Login";
        msg.detail = "Login error";
        msg.statusCode = "401";
        msg.titleError = "Login Error";
        msg.verbose = VerboseType.Error;
        return msg;
    }
};
Login = __decorate([
    Component({
        selector: "login",
        templateUrl: "login.component.html"
    })
], Login);
export { Login };
//# sourceMappingURL=login.component.js.map