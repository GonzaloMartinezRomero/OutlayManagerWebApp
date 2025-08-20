import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';
import { CalendarService } from './services/calendar.service';
import { OutlayManagerAPI } from './services/outlayManagerAPI.service';
import { AmountResumes } from "./views/amountResumes/amountResumes.component";
import { Calendar } from './views/calendar/calendar.component';
import { DateSelector } from "./views/dateSelector/dateSelector.component";
import { NotificationEvent } from "./views/notification/notification.component";
import { ResumeMonthTransaction } from "./views/resumeMonthTransaction/resumeMonthTransaction.component";
import { ResumeOutlays } from './views/resumeOutlays/resumeOutlays.component';
import { SavingChart } from "./views/savingChart/savingChart.component";
import { MainPage } from "./pages/main-page/main-page.component";
import { CommonModule } from "@angular/common";
import { SavingChartPerYear } from "./views/savingChartPerYear/savingChartPerYear.component";
import { ResumeTransaction } from "./views/resumeTransaction/resumeTransaction.component";

@NgModule({
  declarations: [
        AppComponent,
        DateSelector,
        Calendar,
        ResumeOutlays,
        ResumeMonthTransaction,
        SavingChart,      
        AmountResumes,
        NotificationEvent,
        MainPage,
        SavingChartPerYear,
        ResumeTransaction
  ],
  imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule,
      NgbModule,
    NgChartsModule,
    CommonModule
  ],
  providers: [
      CalendarService,
      OutlayManagerAPI,            
  ],
    bootstrap: [AppComponent],
})
export class AppModule { }
