import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

//components
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { LoginComponent } from './auth/login.component';
import { BusRouteComponent } from './component/dashboard/bus-route/bus-route.component';
import { SidebarComponent } from './component/dashboard/sidebar/sidebar.component';
import { BusDriverComponent } from './component/dashboard/bus-driver/bus-driver.component';
import { updateBusrouteComponent } from './component/dashboard/bus-route/update-busroute/update-busroute.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ViewBusRouteComponent } from './component/dashboard/bus-route/view-bus-route/view-bus-route.component';
import { DeleteBusRouteComponent } from './component/dashboard/bus-route/delete-bus-route/delete-bus-route.component';
import { AddRouteComponent } from './component/dashboard/bus-route/add-route/add-route.component';
import { AddBusDriverComponent } from './component/dashboard/bus-driver/add-bus-driver/add-bus-driver.component';
// import { MychartComponent } from './component/dashboard/mychart/mychart.component';

//angular materials (design & styling)
import { MaterialModule } from './material/material/material.module';

//firebase
import {AngularFireModule } from '@angular/fire/compat';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { StatisticComponent } from './component/dashboard/statistic/statistic.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    BusRouteComponent,
    SidebarComponent,
    BusDriverComponent,
    updateBusrouteComponent,
    DashboardComponent,
    ViewBusRouteComponent,
    DeleteBusRouteComponent,
    AddRouteComponent,
    AddBusDriverComponent,
    StatisticComponent
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
  providers: [MatDatepickerModule,
    MatNativeDateModule ],
  bootstrap: [AppComponent],
  entryComponents: [updateBusrouteComponent]
})
export class AppModule { }
