import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs: AngularFirestore) { }

  addBusRoute(busRoute : any) {
    return this.afs.collection("BusRoute/").add(busRoute);
  }

  getAllBusRoutes(){
    return this.afs.collection("BusRoute/").snapshotChanges();
  }

  updateBusRoute(busRoute : any){
    return this.afs.doc("BusRoute/"+busRoute.id).update(busRoute);
  }

  deleteBusRoute(id: string){
    return this.afs.doc("BusRoute/"+id).delete();
  }

  getBusRouteById(id: string){
    return this.afs.doc("BusRoute/"+id).valueChanges();
  }
}
