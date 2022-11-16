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

//angular materials (design & styling)
import { MaterialModule } from './material/material/material.module';

//firebase
import {AngularFireModule } from '@angular/fire/compat';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { BusRouteComponent } from './component/dashboard/bus-route/bus-route.component';
import { SidebarComponent } from './component/dashboard/sidebar/sidebar.component';
import { BusesComponent } from './component/dashboard/buses/buses.component';
import { BusDriverComponent } from './component/dashboard/bus-driver/bus-driver.component';
import { AddBusrouteComponent } from './component/dashboard/bus-route/add-busroute/add-busroute.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './component/dashboard/dashboard.component';

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
    DashboardComponent
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
