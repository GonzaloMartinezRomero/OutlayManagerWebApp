export class TokenStorage {
    static getToken() {
        var token = localStorage.getItem(this.TOKEN_OUTLAYMANAGER_ID);
        return token !== null && token !== void 0 ? token : "";
    }
    static setToken(token) {
        localStorage.setItem(this.TOKEN_OUTLAYMANAGER_ID, token);
    }
}
TokenStorage.TOKEN_OUTLAYMANAGER_ID = "OutlayManagerToken";
//# sourceMappingURL=tokenStorage.js.map