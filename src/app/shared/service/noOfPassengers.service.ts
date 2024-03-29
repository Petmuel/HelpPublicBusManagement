import { identifierName } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore'
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormArray, FormBuilder } from '@angular/forms';
import firebase from 'firebase/compat';
import { BusRoute } from '../model/bus-route';
import { BusDriver } from '../model/bus-driver';
import { Observable, of, single, throwIfEmpty } from 'rxjs';
import { off } from 'process';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnyObject } from 'chart.js/dist/types/basic';
import { NoP } from '../model/noOfPassenger';
@Injectable({
  providedIn: 'root'
})
export class noOfPassengersService {

  constructor(private afs: AngularFirestore, private afa: AngularFireAuth, private snackBar: MatSnackBar) {
  }

 //hardcoded the rating list on bus driver
  // hi(day: any){
  //   var c = this.afs.collection("NumOfPassengers");
  //    c.get().forEach(stopID=>{
  //       stopID.forEach(busStop=>{
  //         busStop.ref.delete();
  //       });
  //   })
  //   // let doc = c.doc();
  //   // rate.countID=doc.ref.id;
  //   // c.doc(doc.ref.id).set(rate);
  // }

  // hi(day: any, rate: any, ko:any){
  //   var obj={
  //         date: ko
  //   }
  //   var c = this.afs.collection("NumOfPassengers");
  //   c.doc(day).set(obj);
  //   var doc =c.doc(day).collection("BusRoute1680460045688").doc()
  //   var docid = doc.ref.id
  //   rate.countID=docid;
  //   c.doc(day).collection("BusRoute1680460045688").doc(docid).set(rate);
  // }

  //testing
  // async getNop(startDate:String, routeId:string){
  //   var s =  await this.getBusStopsByRoute(routeId);
  //   let nops:NoP[]=[];
  //   for(var stop of s){
  //     nops.push(await this.getNopsFromBusStopAndDate(startDate, stop.busStopID))
  //   }
  //   return nops;
  // }

//   getNopsFromBusRouteAndDate(startDate:String, routeId:string){

//     var c = this.afs.collection("NumOfPassengers").doc(startDate) ref => ref
//       .where('busStopID', '==', busStopID)
//       .where('countedDateTime', '==', startDate));

//     return new Promise<any>((resolve)=> {
//       c.valueChanges().subscribe(users => resolve(users));
//     })
//   }

  getNopsFromBusRouteAndDate(date:any, routeId:string){
    var c = this.afs.collection("NumOfPassengers");
    return new Promise<any>((resolve)=> {
      c.doc(date).collection(routeId).valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
    })
  }

  openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action);
  }

  simpleDate(date:any){
    return (date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear())
  }
}


