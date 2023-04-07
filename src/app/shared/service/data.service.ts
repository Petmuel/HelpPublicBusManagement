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

      let doc=this.afs.collection("BusRoute/").doc();
      this.afs.collection("BusRoute/").doc(busRoute.id).set({
        routeNo:busRoute.routeNo,
        description:busRoute.description,
        departure:busRoute.departure,
        arrival:busRoute.arrival
      });
  }

  //adding each bus stop info into the selected bus route's subcollection busStoplist
  addBusStop(busStops:any){
    let stops = busStops as FormArray;

    for(let i=0; i<stops.length;i++){
      let newDoc = this.afs.collection("BusStop").doc();
      let docId = newDoc.ref.id;
      busStops.at(i).busStopID=docId
      this.afs.collection("BusStop").doc(docId).set(busStops.at(i));
    }
  }

  getAllBusRoutes(){
    return this.afs.collection("BusRoute/").snapshotChanges();
  }

  updateBusStop(busRoute:any){
    let docId:any;
    for (let busStop of busRoute.busStops){
      docId=busStop.busStopID;
      if(docId==null||docId==""){
        let newDoc = this.afs.collection("BusStop").doc();
        docId = newDoc.ref.id;
        busStop.busStopID=docId;
      }
      this.afs.collection('BusStop').doc(docId).set(busStop);
    };
  }

  // delete collection busRoute & busStops with same busRouteID
  deleteBusRoute(id: string){
    this.afs.collection('BusStop', ref => ref.where('busRouteId', '==', id))
      .get().forEach(stopID=>{
        stopID.forEach(busStop=>{
          busStop.ref.delete();
        });
    })

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

  getBusStopById(id:string){
    return new Promise<any>((resolve)=> {
      this.afs.collection('BusStop/').doc(id).valueChanges().subscribe(busStop => resolve(busStop));
    })
  }


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
    return new Promise<any>((resolve)=> {
      this.afs.collection('BusStop', ref => ref.where('busRouteId', '==', id)).valueChanges().subscribe(busStops => resolve(busStops));
    })
  }

  findBusStopById(id:string){
    return new Promise<any>((resolve)=> {
      return this.afs.collection('BusStop').doc(id).valueChanges().subscribe(busStop => resolve(busStop));
    })

  }

  deleteBusStop(busRoute:any) {
    for (let stops of busRoute.deletedbusStops){
      this.afs.collection("BusStop").get().forEach(stopID=>{
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

  updateBusDriverAuth(busDriver : any, row: any){
    console.log(row.email)
    console.log(busDriver.email)
    this.afa.signInWithEmailAndPassword(row.email, row.password).then(credential=>{
      if(credential.user){
        credential.user.updateEmail(busDriver.email)
        credential.user.updatePassword(busDriver.password)
      }
    })
    this.afa.signOut()
  }

  updateBusDriver(busDriver: any){
    return this.afs.doc("BusDriver/"+busDriver.id).set(busDriver);
  }

  deleteBusDriver(busDriver: any){
    this.afa.signInWithEmailAndPassword(busDriver.email, busDriver.password)
    .then(result=> {
       if(result.user){
        result.user.delete();
       }
    });
    this.afs.doc("BusDriver/"+busDriver.id).delete();
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


 //hardcoded the rating list on bus driver
  // hi(day: any, rate: any, ko: any){
  //   var obj={
  //     date: ko
  //   }
  //   var c = this.afs.collection("Rating");
  //   c.doc(day).set(obj);
  //   c.doc(day).collection("hfRK37clJ8MEc0sPgyW01YyptVg2").doc(rate.ratingId).set(rate);
  // }

  //testing
  getRate(date:any, driver:any){
    var c = this.afs.collection("Rating");
    // return c.doc('9-2-2023').collection("RatingList").doc('rate1').get();
//     return new Promise<any>((resolve)=> {
//       c.doc('9-2-2023').collection("hfRK37clJ8MEc0sPgyW01YyptVg2").doc('rate1').valueChanges({ ratingId: 'rate1' }).subscribe(users => resolve(users));
//     })
    return new Promise<any>((resolve)=> {
      c.doc(date).collection(driver).valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
    })
  }

  getRate2(date:any, driver:any, rateId:any){
    var c = this.afs.collection("Rating");

      return new Promise<any>((resolve)=> {
        c.doc(date).collection(driver).doc(rateId).valueChanges({ ratingId: 'rate1' }).subscribe(users => resolve(users));
      })
  }

  queryRate(fromDate: any, driverId: any){
    //let rate: any[] = [];

    return this.afs.collection("Rating").doc(fromDate).collection(driverId).snapshotChanges();
    // return c.doc('9-2-2023').collection("RatingList").doc('rate1').get();
    // if (fromDate && toDate != null){
    //   let dates: any[] = [];
    //   while(fromDate <= toDate){
    // //     return new Promise<any>((resolve)=> {
    // //       rate.push(rating.doc(fromDate).collection(driverId).doc('rate1').valueChanges({ ratingId: 'rate1' }).subscribe(users => resolve(users)));
    // //     })
    //     var simpleFromDate = this.simpleDate(fromDate);
    //     rate.push(rating.doc(simpleFromDate).collection(driverId).snapshotChanges)
    //     dates = [...dates, new Date(fromDate)];
    //     fromDate.setDate(fromDate.getDate() + 1);
    //   }
    // }
  }

//   getDrivers(){
//     return new Promise<any>((resolve)=> {
//       this.afs.collection('BusDriver/').valueChanges().subscribe(users => resolve(users));
//     })
//   }

  openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action);
  }

  simpleDate(date:any){
    return (date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear())
  }
}


