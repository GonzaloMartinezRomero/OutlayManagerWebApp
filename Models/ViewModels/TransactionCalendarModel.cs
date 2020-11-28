using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OutlayManagerWeb.Models.ViewModels
{
    public class TransactionCalendarModel
    {
        public readonly List<string> WeekDays = new List<string>()
        {
            "Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo"
        };

        public DateTime TransactionsDate { get; set; }

        public Dictionary<DateTime, List<string>> Transactions { get; set; }
    }
}
