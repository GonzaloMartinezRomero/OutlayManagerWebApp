using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using OutlayManagerWeb.Models.ViewModels;
using System;
using System.Collections.Generic;

namespace OutlayManagerWeb.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;        

        public TransactionCalendarModel TransactionCalendarModel { get; private set; }

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
            //Load month transactions
            TransactionCalendarModel = new TransactionCalendarModel()
            {
                TransactionsDate = new DateTime(2020, 09, 01),

                Transactions = new Dictionary<DateTime, List<string>>()
                {
                    { new DateTime(2020,09,02), new List<string>() {"MERCADONA 100€","SALIR 23€","OTROS 2€" } },
                    { new DateTime(2020,09,05), new List<string>() {"ASDF 100€","SALIR 23€","OTROS 2€" } },
                    { new DateTime(2020,09,23), new List<string>() {"DD 100€","DD 23€","DD 2€" } }
                }
            };
        }
    }
}
