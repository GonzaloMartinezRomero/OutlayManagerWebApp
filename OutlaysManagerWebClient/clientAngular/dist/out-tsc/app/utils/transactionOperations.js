import { ResumeMonthTransacion } from "../model/ResumeMonthTransaction";
export class TransactionOperations {
    static agregateTransacionAmount(collectionMap, transaction) {
        var _a, _b;
        var trCode = transaction.codeTransaction;
        if (collectionMap.has(trCode)) {
            var totalAmount = ((_b = (_a = collectionMap === null || collectionMap === void 0 ? void 0 : collectionMap.get(trCode)) === null || _a === void 0 ? void 0 : _a.amount) !== null && _b !== void 0 ? _b : 0) + transaction.amount;
            totalAmount = Math.round(totalAmount * 100) / 100;
            var updatedTransaction = new ResumeMonthTransacion();
            updatedTransaction.code = trCode;
            updatedTransaction.amount = totalAmount;
            collectionMap.set(trCode, updatedTransaction);
        }
        else {
            var newTransaction = new ResumeMonthTransacion();
            newTransaction.code = trCode;
            newTransaction.amount = transaction.amount;
            collectionMap.set(trCode, newTransaction);
        }
    }
    static comparatorTransactionAmount(a, b) {
        return (a.amount - b.amount) * -1;
    }
}
//# sourceMappingURL=transactionOperations.js.map