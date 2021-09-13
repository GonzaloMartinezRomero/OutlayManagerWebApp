export class MessageView {
    constructor() {
        this.action = "";
        this.titleError = "";
        this.detail = "";
        this.statusCode = "";
        this.verbose = VerboseType.Information;
    }
}
export var VerboseType;
(function (VerboseType) {
    VerboseType[VerboseType["Information"] = 0] = "Information";
    VerboseType[VerboseType["Error"] = 1] = "Error";
})(VerboseType || (VerboseType = {}));
//# sourceMappingURL=MessageView.js.map