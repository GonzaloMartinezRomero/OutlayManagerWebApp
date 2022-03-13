import { __decorate } from "tslib";
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
import { ResumeOutlays } from './views/resumeOutlays/resumeOutlays.component';
import { NgChartsModule } from 'ng2-charts';
import { SavingChart } from "./views/savingChart/savingChart.component";
import { Login } from "./pages/login/login.component";
import { AmountResumes } from "./views/amountResumes/amountResumes.component";
import { ResumeMonthTransaction } from "./views/resumeMonthTransaction/resumeMonthTransaction.component";
let AppModule = class AppModule {
};
AppModule = __decorate([
    NgModule({
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
            AmountResumes
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
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map