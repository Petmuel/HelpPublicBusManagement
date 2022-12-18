import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { FormArray, FormBuilder } from '@angular/forms';
import firebase from 'firebase/compat';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs: AngularFirestore) { }

  addBusRoute(busRoute : any) {
    return this.afs.collection("BusRoute/").doc(busRoute.id).set({
      routeNo:busRoute.routeNo,
      description:busRoute.description,
      destination:busRoute.destination,
      arrival:busRoute.arrival,
    });
  }

  getAllBusRoutes(){
    return this.afs.collection("BusRoute/").snapshotChanges();
  }

  updateBusRoute(busRoute : any){
    return this.afs.doc("BusRoute/"+busRoute.id).update(busRoute);
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

  //adding each bus stop info into the selected bus route's subcollection busStoplist
  addBusStop(id: string, busStops:any){
    // console.log(id);
    // let i= 0
    let stops = busStops as FormArray;
    for(let i=0; i<stops.length;i++){
      // console.log(busStops.at(i))
      this.afs.doc("BusRoute/"+id).collection('busStopList/').add(busStops.at(i))
    }
  }
  // stops !:FormArray<any>;
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
}
