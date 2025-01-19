import { Component } from "@angular/core";

@Component(
    {
        selector: "main-page",
        templateUrl: "main-page.component.html"
    }
)

export class MainPage{

  public readonly DASHBOARD: string = "Dashboard";
  public readonly ANALYCER: string = "Analycer";

  public viewName: string = this.DASHBOARD;

  public updateView(name: string) {
    this.viewName = name;
  }
   
}

