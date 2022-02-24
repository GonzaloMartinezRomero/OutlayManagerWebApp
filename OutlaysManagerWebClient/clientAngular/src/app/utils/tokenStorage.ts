export class TokenStorage
{
    private static TOKEN_OUTLAYMANAGER_ID: string = "OutlayManagerToken";

    public static getToken(): string {

        var token: string | null = localStorage.getItem(this.TOKEN_OUTLAYMANAGER_ID);
        return token ?? "";
    }

    public static setToken(token:string): void {

        localStorage.setItem(this.TOKEN_OUTLAYMANAGER_ID, token);
    }
}