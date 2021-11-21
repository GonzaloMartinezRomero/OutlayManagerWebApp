import { RouterModule } from "@angular/router";
import { Analycer } from "../pages/analycer/analycer.component";
import { Dashboard } from "../pages/dashboard/dashboard.component";

const routes = [
    { path: "", component: Dashboard },
    { path: "Analycer", component: Analycer }
];

const routerConfig = RouterModule.forRoot(routes, { useHash:false });

export default routerConfig;