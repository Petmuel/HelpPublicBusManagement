import { NgModule } from '@angular/core';
import { LoginComponent } from './auth/login.component';
import { RouterModule, Routes } from '@angular/router';
import { BusRouteComponent } from './component/dashboard/bus-route/bus-route.component';
// import { BusesComponent } from './component/dashboard/buses/buses.component';
import { BusDriverComponent } from './component/dashboard/bus-driver/bus-driver.component';
import { ViewBusRouteComponent } from './component/dashboard/bus-route/view-bus-route/view-bus-route.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
// import { AddRouteComponent } from './component/dashboard/bus-route/add-route/add-route.component';
// import { MychartComponent } from './component/dashboard/mychart/mychart.component';
import { StatisticComponent } from './component/dashboard/statistic/statistic.component';
import { noOfPassengersComponent } from './component/dashboard/noOfPassengers/noOfPassengers.component';
import { workingHoursComponent } from './component/dashboard/workingHours/workingHours.component';
const routes: Routes = [
  {path: 'dashboard',
    component: DashboardComponent,
    children:[
    {path: 'dashboard/busRoute', redirectTo: 'busRoute', pathMatch: 'full'},
    {path:'busRoute', component: BusRouteComponent},
    // {path:'busRoute/create', component: AddRouteComponent},
    // {path:'edit/:id', component: AddRouteComponent},
    {path:'busRoute/:id', component: ViewBusRouteComponent},
    {path: 'statistic', component: StatisticComponent},
    {path: 'noOfPassengers', component: noOfPassengersComponent},
    {path: 'workingHours', component: workingHoursComponent},
    {path:'busDriver', component: BusDriverComponent}
    // {path: 'busRoute/multiform', redirectTo: 'multiform', pathMatch: 'full'}
  ]
  },
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
