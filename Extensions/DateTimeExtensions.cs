using System;
using System.Globalization;

namespace OutlayManagerWeb.Extensions
{
    public static class DateTimeExtensions
    {
        public static int WeekDayES(this DateTime dateTime, CultureInfo culture)
        {
            switch (dateTime.DayOfWeek)
            {
                case DayOfWeek.Monday:
                    return 1;
                case DayOfWeek.Tuesday:
                    return 2;
                case DayOfWeek.Wednesday:
                    return 3;
                case DayOfWeek.Thursday:
                    return 4;
                case DayOfWeek.Friday:
                    return 5;
                case DayOfWeek.Saturday:
                    return 6;
                case DayOfWeek.Sunday:
                    return 7;
                default:
                    return -1;
            }
        }
    }
}
