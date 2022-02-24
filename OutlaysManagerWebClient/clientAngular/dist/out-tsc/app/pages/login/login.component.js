import { __decorate } from "tslib";
import { Component } from "@angular/core";
import { MessageView, VerboseType } from "../../model/MessageView";
import { ExceptionUtils } from "../../utils/exceptionUtils";
import { TokenStorage } from "../../utils/tokenStorage";
let Login = class Login {
    constructor(outlayManagerAPI, mainApp, router) {
        this.outlayManagerAPI = outlayManagerAPI;
        this.mainApp = mainApp;
        this.router = router;
        this.userLogin = "";
        this.userPassword = "";
    }
    ngOnInit() {
        var token = TokenStorage.getToken();
        if (token != null && token != "") {
            this.outlayManagerAPI.isTokenValid(token).then(value => {
                if (value) {
                    this.router.navigateByUrl('Dashboard');
                }
            });
        }
    }
    login() {
        this.outlayManagerAPI.requestJWTTokenAuthorization(this.userLogin, this.userPassword)
            .subscribe(response => {
            if (response.credentialToken === undefined || response.credentialToken === "") {
                this.mainApp.openModalMessage(this.buildMsgErrorLogin());
            }
            else {
                try {
                    TokenStorage.setToken(response.credentialToken);
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