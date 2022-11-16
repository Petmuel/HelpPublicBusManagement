import { NgModule } from '@angular/core';
import { LoginComponent } from './auth/login.component';
import { RouterModule, Routes } from '@angular/router';
import { BusRouteComponent } from './component/dashboard/bus-route/bus-route.component';
import { BusesComponent } from './component/dashboard/buses/buses.component';
import { BusDriverComponent } from './component/dashboard/bus-driver/bus-driver.component';
import { ViewBusRouteComponent } from './component/dashboard/bus-route/view-bus-route/view-bus-route.component';

const routes: Routes = [
  {path: 'dashboard', children:[
    {path: '', redirectTo: 'busRoute', pathMatch: 'full'},
    {path:'busRoute', component: BusRouteComponent},
    {path:'busRoute/:id', component: ViewBusRouteComponent},
    {path:'buses', component: BusesComponent},
    {path:'busDriver', component: BusDriverComponent}
  ]},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
