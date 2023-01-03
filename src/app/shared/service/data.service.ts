import { identifierName } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore'
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormArray, FormBuilder } from '@angular/forms';
import firebase from 'firebase/compat';
import { BusRoute } from '../model/bus-route';
import { BusDriver } from '../model/bus-driver';
import { Observable, of } from 'rxjs';
import { off } from 'process';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs: AngularFirestore, private afa: AngularFireAuth, private snackBar: MatSnackBar) {
  }
  // private data: any;

  // setData(data:any){
  //   this.data = data;
  // }

  // getData(){
  //     return this.data;
  // }

  // hasData(){
  //     return this.data && this.data.length;
  // }


  addBusRoute(busRoute : any) {
    return this.afs.collection("BusRoute/").doc(busRoute.id).set({
      routeNo:busRoute.routeNo,
      description:busRoute.description,
      destination:busRoute.destination,
      arrival:busRoute.arrival,
    });
  }

  //adding each bus stop info into the selected bus route's subcollection busStoplist
  addBusStop(id: string, busStops:any){
    let stops = busStops as FormArray;
    for(let i=0; i<stops.length;i++){
      busStops.at(i).busStopID="BusStop"+i;
      this.afs.doc("BusRoute/"+id).collection('busStopList/').doc(busStops.at(i).busStopID).set(busStops.at(i));
    }
  }

  getAllBusRoutes(){
    return this.afs.collection("BusRoute/").snapshotChanges();
  }

  updateBusStop(busRoute:any){
    for (let route of busRoute.busStops){
      this.afs.doc("BusRoute/"+busRoute.id).collection('busStopList/').doc(route.busStopID).set(route);
    };
  }

  deleteBusRoute(id: string){
    //delete subcollection busStopList
    this.afs.doc("BusRoute/"+id).collection('busStopList/').get().forEach(stopID=>{
      stopID.forEach(busStop=>{
        busStop.ref.delete();
      })
    })
    //delete collection busRoute
    this.afs.doc("BusRoute/"+id).delete();
  }

  getBusRouteById(id: string){
    return this.afs.doc("BusRoute/"+id).valueChanges();
  }

  // isBusRouteChange(busRoute:any){
  //   let routeObj!: any;
  //   return this.afs.doc("BusRoute/"+busRoute.id).valueChanges().subscribe(res=>{
  //     routeObj=res;
  //     console.log('retreived route: ',routeObj.routeNo);
  //     console.log('input: ',busRoute.routeNo);
  //     if (routeObj.routeNo== busRoute.routeNo||
  //       routeObj.description== busRoute.description||
  //       routeObj.destination== busRoute.destination||
  //       routeObj.arrival== busRoute.arrival){
  //         console.log('True very');
  //       }
  //   })
  // }


  // stops !:FormArray<any>;
  //retrieving documents from bus stop sub-collection in firebase
  getBusStopsByRoute(id:string){
    // let stops = this.afs.doc("BusRoute/"+id).collection('busStopList/').get();
    // let stops: any;

    // constthis.afs.doc("BusRoute/"+id).collection('busStopList/').get().forEach(stopID=>{
    //   stopID.forEach(busStop=>{
    //     console.log(busStop.ref.collection)
    //   })
    // })
    return this.afs.doc("BusRoute/"+id).collection('busStopList/').snapshotChanges()

  }

  returnBusStop(id:string){
    return this.afs.doc("BusRoute/"+id).collection('busStopList/').valueChanges()
  }

  deleteBusStop(busRoute:any) {
    for (let stops of busRoute.deletedbusStops){
      this.afs.doc("BusRoute/"+busRoute.id).collection("busStopList/").get().forEach(stopID=>{
        stopID.forEach(busStop=>{
          if(busStop.id==stops.busStopID){
            busStop.ref.delete();
          }
        })
      })
    }
    return
  }

  //bus driver
  addBusDriver(busDriver : any) {

    this.afa.fetchSignInMethodsForEmail(busDriver.email)
    .then((result)=> {
       if(result.length > 0){
        window.alert("Email has already been used, please try again");
       }
       else{
        this.afa.createUserWithEmailAndPassword(busDriver.email, busDriver.password).then((result)=>{
          this.SetUserData(result.user, busDriver);
        })
        this.snackBar.open('Bus driver saved successfully.','OK',{
            duration: 2000
          })
       }
    });
  }

  getAllBusDrivers(){
    return this.afs.collection("BusDriver/").snapshotChanges();
  }

  updateBusDriver(busDriver : any){
    return this.afs.doc("BusDriver/"+busDriver.id).set(busDriver);
  }

  deleteBusDriver(busDriver: any){
    this.afs.doc("BusDriver/"+busDriver.id).delete();
    this.afa.signInWithEmailAndPassword(busDriver.email, busDriver.password)
    .then((result)=> {
       if(result.user){
        result.user.delete();
       }
    });
  }

  getBusDriverById(id: string){
    return this.afs.doc("BusDriver/"+id).valueChanges();
  }

  //add the created user to firestore (addBusDriver())
  SetUserData(user: any, busDriver:any) {
    var busdriverObj={
      id: user.uid,
      fullName: busDriver.fullName,
      email:busDriver.email,
      password:busDriver.password,
      phoneNo:busDriver.phoneNo,
      driverNo:busDriver.driverNo,
      cLong: busDriver.cLong,
      cLat:busDriver.cLat,
      status:busDriver.status
    }
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `BusDriver/${user.uid}`
    );
    return userRef.set(busdriverObj)
  }

  openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action);
    }
}
