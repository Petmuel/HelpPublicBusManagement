import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
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
  departure !: string;
  arrival !: string;
  id !: string;
  buttonName!: string;
  busStops!: any
  busStopForm!: FormArray<any>;
  busStopArr!: any;
  deletedbusStopForm!: FormArray<any>;

  //google maps
  @ViewChild('myGoogleMap', { static: false })
  map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false })
  info!: MapInfoWindow;
  geocoder!: google.maps.Geocoder;
  display:any;
  zoom = 11;
  center: google.maps.LatLngLiteral={lat:3.0907  , lng: 101.59651};
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  }
  markers = []  as  any;
  infoContent = ''

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
      this.departure = data.departure;
      this.arrival = data.arrival;
      this.buttonName = data.buttonName;

      this.form = this.fb.group({
      id:[this.id, []],
      routeNo:[this.routeNo, [Validators.required]],
      description: [this.description, [Validators.required]],
      departure: [this.departure, [Validators.required]],
      arrival: [this.arrival, [Validators.required]],
      busStops: this.fb.array([]),
      deletedbusStops:this.fb.array([])
      });
      // this.busStops = data.busStops;  //hard-coded
    }
  ngOnInit(): void {
    this.getBusStops(this.id);
  }



  cancelRegistration(){
    this.dialogRef.close();
  }

  registerBusRoute(){
    console.log(this.form.getRawValue())
    this.dialogRef.close(this.form.getRawValue());
  }

  addStops(stop:any){
    this.busStopForm=this.form.get("busStops") as FormArray;
    this.busStopForm.push(this.row(stop));
    this.dropAddedMarkers(stop.longitude, stop.latitude, stop.address, stop.busStop)
    //this.markerPositions.push(new google.maps.LatLng(stop.latitude, stop.longitude))
  }

  addBusStops(lat:any, lng:any, busStop:String, address: String, sublocal:String){
    this.busStopForm=this.form.get("busStops") as FormArray;
    if(sublocal==undefined||sublocal==""){
      sublocal=address.split(/\s/)[0];
    }
    this.busStopForm.push(this.generatorRow(Number(lat), Number(lng),busStop,address,sublocal));
    this.updateDepartureAndArrival();
  }

  generatorRow(lat: any, lng:any, busStop: String, address:String, sublocal:String){
    return this.fb.group({
      busStopID: "BusStop"+Date.now(),
      busRouteNo:this.fb.control(this.form.value.routeNo),
      busStop:new FormControl({
        value: busStop,
        disabled: true
      }),
      name:new FormControl({
        value: sublocal,
        disabled: true
      }),
      address:new FormControl({
        value: address,
        disabled: true
      }),
      longitude:new FormControl({
        value: lng,
        disabled: true
      }),
      latitude:new FormControl({
        value: lat,
        disabled: true
      })
    });
  }

  row(stop:any){
    return this.fb.group({
      busStopID: this.fb.control(stop.busStopID),
      busRouteNo:this.fb.control(stop.routeNo),
      busStop:new FormControl({
        value: stop.busStop,
        disabled: true
      }),
      name:new FormControl({
        value: stop.name,
        disabled: true
      }),
      address:new FormControl({
        value: stop.address,
        disabled: true
      }),
      longitude:new FormControl({
        value: stop.longitude,
        disabled: true
      }),
      latitude:new FormControl({
        value: stop.latitude,
        disabled: true
      }),
    });
  }

  removeBusStop(index:any){
    if (confirm('do you want to remove this bus stop?')){
	    this.deletedbusStopForm=this.form.get("deletedbusStops") as FormArray;
      this.deletedbusStopForm.push(this.row(this.busStopForm.at(index).value));
      this.busStopForm=this.form.get("busStops") as FormArray;
      this.busStopForm.removeAt(index);
      this.updateMarkers(index, this.markers)
      this.updateFormBusStop(this.busStopForm, index);
      this.updateDepartureAndArrival()
    }
  }

  get allBusStops(){
    return this.form.get("busStops") as FormArray;
  }

  //storing retrieved documents in busStops array
  async getBusStops(id:string){
    await this.dataApi.getBusStopsByRoute(id).subscribe(res=>{
      this.busStopArr=res.map((e:any)=>{
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      })
      this.busStopArr.sort((a: { busStop: string; }, b: { busStop: any; }) =>
        a.busStop.localeCompare(b.busStop));
      for(let busStop of this.busStopArr){
        console.log(busStop.busStop)
        this.addStops(busStop);
      }
    });
    // this.center = {lat: this.busStopArr[0].latitude, lng: this.busStopArr[0].longitude};
    // this.zoom = 15;
  }



  updateFormBusStop(formBusStop: FormArray<any>, index: any) {
    for(var i = index; i < formBusStop.length; i++) {
      formBusStop.at(i).patchValue({busStop:this.markers[i].title})
    }
  }

  //set destination to the first bus stop name
  updateDepartureAndArrival(){
    this.form.controls['departure'].setValue(this.busStopForm.at(0).getRawValue().name);
    this.form.controls['arrival'].setValue(this.busStopForm.at(this.busStopForm.length-1).getRawValue().name);
  }

  /////////////////////////// GOOGLE MAP /////////////////////////////////
  //Add new markers
  async dropMarker(event:any) {
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    var locations = await this.getAddress(lat, lng);
    var address = locations.address;
    var busStop = "Bus Stop " + (this.markers.length + 1);
    this.markers.push({
      position: {
        lat: lat,
        lng: lng
      },
      label: {
        color: 'blue',
        text:  busStop,
      },
      title: busStop,
      info: address,
      options: {
        animation: google.maps.Animation.DROP,
      },
    })
    this.addBusStops(lat, lng, busStop, address, locations.sublocal);
  }

  //get nearest address from the marker lat and lng
  async getAddress(lat:any, lng:any){
    var address="";
    var locations:any;
    var sublocal:any;
    const KEY = "AIzaSyAupM29ityoxRwEKvxC2Z8nZOb9H20-3lo";
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${KEY}`;
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      address = data.results[0].formatted_address
      locations = data.results[0].address_components;
      // sublocal=locations.find((x:{long_name: any; types: string | string[];})=> x.types==="sublocality_level_1").long_name;

      locations.forEach((a: {long_name: any; types: string | string[];}) => {
        if (a.types.includes("sublocality_level_1")) {
          sublocal= a.long_name;
        }
      })
    })
    return {address:address, sublocal: sublocal};
  }

  //drop the retrieved markers
  dropAddedMarkers(lng:any, lat:any, address:String, busStop:String){
    this.markers.push({
      position: {
        lat: lat,
        lng: lng
      },
      label: {
        color: 'blue',
        text:  busStop,
      },
      title: busStop,
      info: address,
      options: {
        animation: google.maps.Animation.DROP,
      },
    })
  }

  move(event: google.maps.MapMouseEvent){
    if(event.latLng!= null){
      this.display = (event.latLng.toJSON());
    }
  }

   //update markers when removing one of them
   updateMarkers(index:number, markers:Array<any>){
    this.markers= this.markers.slice(0, index)
    let i =index;
    while(markers[i+1]!=null){
      this.markers.push({
        position: markers[i+1].position,
        label: {
          color: 'blue',
          text: 'Bus Stop ' + (i+ 1),
        },
        title: 'Bus Stop ' + (i + 1),
        info: markers[i+1].info,
        options: {
          animation: google.maps.Animation.DROP,
        },
      })
      if(markers.length-this.markers.length==1) {
        markers[i+1]= null;
      }
      i++
    }
  }

  //display marker info
  openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;
    this.info.open(marker)
  }
  /////////////////////////// End of GOOGLE MAP /////////////////////////////////
}
