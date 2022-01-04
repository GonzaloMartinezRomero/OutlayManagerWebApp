import { ExceptionAPI } from "../model/ExceptionAPI";
import { MessageView, VerboseType } from "../model/MessageView";

export class ExceptionUtils {

    public static buildMessageErrorFromAPIError(exceptionAPI: ExceptionAPI): MessageView {

        var messageView = new MessageView();

        messageView.action = exceptionAPI.EndPoint;
        messageView.titleError = "API ERROR";
        messageView.detail = exceptionAPI.Message;
        messageView.statusCode = exceptionAPI.StatusCode;
        messageView.verbose = VerboseType.Error;

        return messageView;
    }
}