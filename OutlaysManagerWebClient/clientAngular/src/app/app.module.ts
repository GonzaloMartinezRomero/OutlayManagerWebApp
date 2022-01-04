import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { Analycer } from "./pages/analycer/analycer.component";
import { Dashboard } from "./pages/dashboard/dashboard.component";
import routerConfig from './router/router';
import { CalendarService } from './services/calendar.service';
import { OutlayManagerAPI } from './services/outlayManagerAPI.service';
import { Calendar } from './views/calendar/calendar.component';
import { DateSelector } from "./views/dateSelector/dateSelector.component";
import { ResumeMonthTransactions } from './views/resumeMonthTransactions/resumeMonthTransactions.component';
import { ResumeOutlays } from './views/resumeOutlays/resumeOutlays.component';
import { NgChartsModule } from 'ng2-charts';
import { SavingChart } from "./views/savingChart/savingChart.component";
import { Login } from "./pages/login/login.component";

@NgModule({
  declarations: [
        AppComponent,
        DateSelector,
        Calendar,
        ResumeOutlays,
        ResumeMonthTransactions,
        Dashboard,
        Analycer,
        SavingChart,
        Login
  ],
  imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule,
      NgbModule,
      routerConfig,
      NgChartsModule
  ],
  providers: [
      CalendarService,
      OutlayManagerAPI,
      AppComponent     
  ],
  bootstrap: [AppComponent]
    

})
export class AppModule { }
