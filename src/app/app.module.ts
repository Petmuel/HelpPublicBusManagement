import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
//components
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { LoginComponent } from './auth/login.component';
import { BusRouteComponent } from './component/dashboard/bus-route/bus-route.component';
import { SidebarComponent } from './component/dashboard/sidebar/sidebar.component';
import { BusesComponent } from './component/dashboard/buses/buses.component';
import { BusDriverComponent } from './component/dashboard/bus-driver/bus-driver.component';
import { AddBusrouteComponent } from './component/dashboard/bus-route/add-busroute/add-busroute.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ViewBusRouteComponent } from './component/dashboard/bus-route/view-bus-route/view-bus-route.component';
import { DeleteBusRouteComponent } from './component/dashboard/bus-route/delete-bus-route/delete-bus-route.component';
import { MultiformsComponent } from './component/dashboard/bus-route/multiforms/multiforms.component';
import { AddRouteComponent } from './component/dashboard/bus-route/add-route/add-route.component';
import { AddBusDriverComponent } from './component/dashboard/bus-driver/add-bus-driver/add-bus-driver.component';

//angular materials (design & styling)
import { MaterialModule } from './material/material/material.module';

//firebase
import {AngularFireModule } from '@angular/fire/compat';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    BusRouteComponent,
    SidebarComponent,
    BusesComponent,
    BusDriverComponent,
    AddBusrouteComponent,
    DashboardComponent,
    ViewBusRouteComponent,
    DeleteBusRouteComponent,
    MultiformsComponent,
    AddRouteComponent,
    AddBusDriverComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [AddBusrouteComponent]
})
export class AppModule { }
