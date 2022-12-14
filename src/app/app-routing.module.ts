import { NgModule } from '@angular/core';
import { LoginComponent } from './auth/login.component';
import { RouterModule, Routes } from '@angular/router';
import { BusRouteComponent } from './component/dashboard/bus-route/bus-route.component';
import { BusesComponent } from './component/dashboard/buses/buses.component';
import { BusDriverComponent } from './component/dashboard/bus-driver/bus-driver.component';
import { ViewBusRouteComponent } from './component/dashboard/bus-route/view-bus-route/view-bus-route.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { MultiformsComponent } from './component/dashboard/bus-route/multiforms/multiforms.component';

const routes: Routes = [
  {path: 'dashboard',
    component: DashboardComponent,
    children:[
    {path: 'dashboard/busRoute', redirectTo: 'busRoute', pathMatch: 'full'},
    {path:'busRoute', component: BusRouteComponent},
    {path:'busRoute/:id', component: ViewBusRouteComponent},
    {path:'buses', component: BusesComponent},
    {path:'busDriver', component: BusDriverComponent},
    {path: 'dashboard/multiform', redirectTo: 'multiform', pathMatch: 'full'},
    {path:'multiform', component: MultiformsComponent}
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
