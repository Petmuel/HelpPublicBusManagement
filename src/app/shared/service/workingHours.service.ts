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
export class workingHoursService {

  constructor(private afs: AngularFirestore, private afa: AngularFireAuth, private snackBar: MatSnackBar) {
  }

 //hardcoded the rating list on bus driver
  // hi(day: any, obj:any, a:any){
  //   var c = this.afs.collection("DriveRecord");
  //   //var v = this.afs.collection("WorkingHour")
  //   //  c.get().forEach(stopID=>{
  //   //     stopID.forEach(busStop=>{
  //   //       busStop.ref.delete();
  //   //     });
  //   // })
  //   // let doc = c.doc();
  //   // rate.countID=doc.ref.id;
  //   c.doc(day).collection("DriveRecordList").doc("zwauDFnI3MUuMd2oxnNP").set(obj);
  //   // v.doc().set({
  //   //   driveRecordId: "zwauDFnI3MUuMd2oxnNP",
  //   //   driveDuration: a,
  //   //   endTime: new Date(day),
  //   //   startTime: new Date(day)
  //   // })
  // }


  getNopsFromBusRouteAndDate(date:any, routeId:string){
    var c = this.afs.collection("NumOfPassengers");
    return new Promise<any>((resolve)=> {
      c.doc(date).collection(routeId).valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
    })
  }


  async getAllDriverRecordsAndWorkingHours(date:any, driverId:String){
    let driverRecord = await this.getDriveRecord(date, driverId)
    let driverRecordId = await this.getDriveRecordID(date, driverId)
    //let wk = await this.getWorkingHours(driverRecord.doc.id)
    let workingHour= await this.getWorkingHours(driverRecordId)
    //driverRecord.duration=wk.driveDuration;
    var wkObj={
      driverRecordId: driverRecordId,
      busRouteId: driverRecord.busRouteId,
      date: driverRecord.recordDate,
      duration: workingHour.duration
    }
    console.log(wkObj)
    return wkObj;
  }

  getWorkingHours(driveRecordId:String){
    var f = this.afs.collection("WorkingHour");
    return new Promise<any>((resolve)=> {
      this.afs.collection("WorkingHour", ref => ref.where('driveRecordId', '==', driveRecordId)).valueChanges({ idField: 'id' }).subscribe(busStops => resolve(busStops));
    })
  }

  getDriveRecordID(date: any, driverId: String){
    var f = this.afs.collection("DriveRecord");
    return new Promise<any>((resolve)=> {
      f.doc(date).collection("DriveRecordList", ref => ref.where('busDriverId', '==', driverId)).get().subscribe(busStops => resolve(busStops.docs[0].id));
    })
  }

  getDriveRecord(date: any, driverId: String){
    var f = this.afs.collection("DriveRecord");
    return new Promise<any>((resolve)=> {
      f.doc(date).collection("DriveRecordList", ref => ref.where('busDriverId', '==', driverId)).valueChanges({ idField: 'id' }).subscribe(busStops => resolve(busStops));
    })
  }
}


