export const environment = {
    production: true,
    hostOutlayManagerAPI: "http://localhost:5000",
    outlayManagerAPIEndpoints: {
        Authorization: "/Identity/Authenticate",
        Transactions: "/Transactions",
        TransactionsCode: "/TransactionCodes",
        TransactionsInfo: {
            TransactionTypes: "/TransactionInfo/TransactionTypes",
            TransactionYearsAvailables: "/TransactionInfo/YearsAvailables",
            AmountResumes: "/TransactionInfo/AmountResumes"
        },
        DownloadExternalTransaction: "/ExternalTransaction/Download"
    }
};
//# sourceMappingURL=environment.prod.js.map