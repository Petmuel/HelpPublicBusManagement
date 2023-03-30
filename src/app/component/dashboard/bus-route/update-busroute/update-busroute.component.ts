import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/service/data.service';

@Component({
  selector: 'app-update-busroute',
  templateUrl: './update-busroute.component.html',
  styleUrls: ['./update-busroute.component.css']
})
export class updateBusrouteComponent implements OnInit {
  form !: FormGroup;
  title!: string;
  routeNo !: string;
  description !: string;
  destination !: string;
  arrival !: string;
  id !: string;
  buttonName!: string;
  busStops!: any
  busStopForm!: FormArray<any>;
  busStopArr!: any;
  deletedbusStopForm!: FormArray<any>;
  constructor(
    private fb : FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dataApi: DataService,
    private dialogRef:  MatDialogRef<updateBusrouteComponent>
    ) {
      this.id = data.id;
      this.title = data.title;
      this.routeNo = data.routeNo;
      this.description = data.description;
      this.destination = data.destination;
      this.arrival = data.arrival;
      this.buttonName = data.buttonName;

      this.form = this.fb.group({
      id:[this.id, []],
      routeNo:[this.routeNo, [Validators.required]],
      description: [this.description, [Validators.required]],
      destination: [this.destination, [Validators.required]],
      arrival: [this.arrival, [Validators.required]],
      busStops: this.fb.array([]),
      deletedbusStops:this.fb.array([])
      });
      // this.busStops = data.busStops;  //hard-coded
    }
  /////////google map////////
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow|undefined;
  markerLocation:string="";
  display:any;
  center: google.maps.LatLngLiteral={lat:3.068  , lng: 101.60};
  zoom=10;
  markerOptions: google.maps.MarkerOptions={draggable: false};
  markerPositions: google.maps.LatLngLiteral[]=[
    {
        lat: 101.512,
        lng: 2.957
    },
    {
        lat: 101.561,
        lng: 3.020
    }
]

  moveMap(event: google.maps.MapMouseEvent){
    if(event.latLng!= null){
      this.center = (event.latLng.toJSON());
    }
  }

  addMarker(event: google.maps.MapMouseEvent){
    if(event.latLng!= null){
      this.markerPositions.push(event.latLng.toJSON());
    }
    this.addBusStops(event.latLng?.lat().toFixed(3), event.latLng?.lng().toFixed(3));
  }
  move(event: google.maps.MapMouseEvent){
    if(event.latLng!= null){
      this.display = (event.latLng.toJSON());
    }
  }

  openInfoWindow(marker: MapMarker){
    if(this.infoWindow!=undefined){
      this.infoWindow.open(marker);
      this.markerLocation=
        "Lat: "+ marker.getPosition()?.lat().toFixed(3)+
        ", Long: "+ marker.getPosition()?.lng().toFixed(3);
    }
  }

  /////////google map////////

  ngOnInit(): void {
    this.getBusStops(this.id);
    console.log(this.markerPositions)
  }


  cancelRegistration(){
    this.dialogRef.close();
  }

  registerBusRoute(){
    this.dialogRef.close(this.form.value);
  }

  addStops(stop:any){
    this.busStopForm=this.form.get("busStops") as FormArray;
    this.busStopForm.push(this.row(stop));

    //this.markerPositions.push(new google.maps.LatLng(stop.latitude, stop.longitude))
  }

  addBusStops(lat:any, lng:any){
    this.busStopForm=this.form.get("busStops") as FormArray;
    this.busStopForm.push(this.generatorRow(lat, lng));
  }

  generatorRow(lat: any, lng:any){
    return this.fb.group({
      busStopID: '',
      busRouteNo:this.fb.control(this.form.value.routeNo),
      name:this.fb.control(''),
      address:this.fb.control(''),
      longitude:this.fb.control(lat),
      latitude:this.fb.control(lng),
    });
  }

  row(stop:any){
    return this.fb.group({
      busStopID: this.fb.control(stop.busStopID),
      busRouteNo:this.fb.control(stop.routeNo),
      name:this.fb.control(stop.name),
      address:this.fb.control(stop.address),
      longitude:this.fb.control(stop.longitude),
      latitude:this.fb.control(stop.latitude),
    });
  }

  removeBusStop(index:any){
    if (confirm('do you want to remove this bus stop?')){
      this.busStopForm=this.form.get("busStops") as FormArray;
      this.deletedbusStopForm=this.form.get("deletedbusStops") as FormArray;
      this.deletedbusStopForm.push(this.row(this.busStopForm.at(index).value));
      this.deleteBusStop(index)
      //this.dataApi.deleteBusStop(this.busStopForm.at(index).value, this.id)
      // this.deletedbusStopForm=this.form.get("deletedbusStops") as FormArray
    }
  }

  get allBusStops(){
    return this.form.get("busStops") as FormArray;
  }

  //storing retrieved documents in busStops array
  getBusStops(id:string){
    this.dataApi.getBusStopsByRoute(id).subscribe(res=>{
      this.busStopArr=res.map((e:any)=>{
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      })
      for(let busStop of this.busStopArr){
        this.addStops(busStop);
      }
    });
  }

  deleteBusStop(index: any){
    this.busStopForm=this.form.get("busStops") as FormArray;
    this.busStopForm.removeAt(index);
  }

  // setBusStop(busStop :any){
  //   this.deletedbusStopForm=this.form.get("deletedbusStops") as FormArray;
  //   this.deletedbusStopForm.push(busStop);
  // }
  // //Add the retrieved bus stop to the form.value.busStops
  // setBusStopArr(data: any[]){
  //   for(let busStop of data){
  //     this.addStops(busStop);
  //   }
  // }

  // getBusStops(id:string){
  //   this.dataApi.getBusStopsByRoute(id).subscribe((actionArray) => {
  //     this.busStops = actionArray.map((item) => ({
  //       id: item.payload.doc.id,
  //       ...item.payload.doc.data(),
  //       expanded: false

  //     }));
  //     console.log('inner',this.busStops)
  //   });
  //   console.log(this.busStops)
  // }
}
