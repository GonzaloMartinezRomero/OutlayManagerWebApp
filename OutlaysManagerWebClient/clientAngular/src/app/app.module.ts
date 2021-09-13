import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CalendarService } from './services/calendar.service';
import { DateSelector } from "./views/dateSelector/dateSelector.component";
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { OutlayManagerAPI } from './services/OutlayManagerAPI.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Calendar } from './views/calendar/calendar.component';

@NgModule({
  declarations: [
        AppComponent,
        DateSelector,
        Calendar,        
  ],
  imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule,
      NgbModule
  ],
  providers: [
      CalendarService,
      OutlayManagerAPI,
      AppComponent
  ],
    bootstrap: [AppComponent]
    

})
export class AppModule { }
