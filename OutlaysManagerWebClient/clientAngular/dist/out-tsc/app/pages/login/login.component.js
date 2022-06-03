import { __decorate } from "tslib";
import { Component, ViewChild } from "@angular/core";
import { MessageView, VerboseType } from "../../model/MessageView";
import { ExceptionUtils } from "../../utils/exceptionUtils";
import { TokenStorage } from "../../utils/tokenStorage";
let Login = class Login {
    constructor(outlayManagerAPI, router) {
        this.outlayManagerAPI = outlayManagerAPI;
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
            var _a, _b;
            if (response.credentialToken === undefined || response.credentialToken === "") {
                (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.openModalMessage(this.buildMsgErrorLogin());
            }
            else {
                try {
                    TokenStorage.setToken(response.credentialToken);
                    this.router.navigateByUrl('Dashboard');
                }
                catch (exception) {
                    (_b = this.notificationComponent) === null || _b === void 0 ? void 0 : _b.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(exception));
                }
            }
        }, error => {
            var _a;
            (_a = this.notificationComponent) === null || _a === void 0 ? void 0 : _a.openModalMessage(ExceptionUtils.buildMessageErrorFromAPIError(error));
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
__decorate([
    ViewChild("notificationComponent")
], Login.prototype, "notificationComponent", void 0);
Login = __decorate([
    Component({
        selector: "login",
        templateUrl: "login.component.html"
    })
], Login);
export { Login };
//# sourceMappingURL=login.component.js.map