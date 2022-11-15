import { NgModule } from '@angular/core';
import { LoginComponent } from './auth/login.component';
import { ManageBusRouteComponent } from './busRoute/manage.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'manage', component: ManageBusRouteComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
