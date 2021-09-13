export class MessageView {
    public action: string = "";
    public titleError: string = "";
    public detail: string = "";
    public statusCode: string = "";
    public verbose: VerboseType = VerboseType.Information;
}

export enum VerboseType {
    Information,
    Error
}