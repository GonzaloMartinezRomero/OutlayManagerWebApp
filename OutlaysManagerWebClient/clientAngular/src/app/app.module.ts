import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';
import { Analycer } from "./pages/analycer/analycer.component";
import { Dashboard } from "./pages/dashboard/dashboard.component";
import { Login } from "./pages/login/login.component";
import routerConfig from './router/router';
import { CalendarService } from './services/calendar.service';
import { OutlayManagerAPI } from './services/outlayManagerAPI.service';
import { AmountResumes } from "./views/amountResumes/amountResumes.component";
import { Calendar } from './views/calendar/calendar.component';
import { DateSelector } from "./views/dateSelector/dateSelector.component";
import { NotificationEvent } from "./views/notification/notification.component";
import { ResumeMonthTransaction } from "./views/resumeMonthTransaction/resumeMonthTransaction.component";
import { ResumeOutlays } from './views/resumeOutlays/resumeOutlays.component';
import { SavingChart } from "./views/savingChart/savingChart.component";

@NgModule({
  declarations: [
        AppComponent,
        DateSelector,
        Calendar,
        ResumeOutlays,
        ResumeMonthTransaction,
        Dashboard,
        Analycer,
        SavingChart,
        Login,
        AmountResumes,
        NotificationEvent
  ],
  imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule,
      NgbModule,
      routerConfig,
      NgChartsModule,     
  ],
  providers: [
      CalendarService,
      OutlayManagerAPI,            
  ],
    bootstrap: [AppComponent],
})
export class AppModule { }
