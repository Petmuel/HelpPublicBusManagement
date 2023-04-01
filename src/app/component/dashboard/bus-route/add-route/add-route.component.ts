import { Component, DoCheck, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/shared/service/data.service';
import { ViewChild } from '@angular/core'
@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.css']
})

export class AddRouteComponent implements OnInit{
  //google map data
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

  //bus route data
  routeRegister !: FormGroup;
  title!: string;
  routeNo !: string;
  description !: string;
  departure !: string;
  arrival !: string;
  id !: string;
  buttonName!: string;
  stops!: FormArray<any>;
  formBusStop !: FormArray<any>;
  addDestination !: FormControl;
  editData: any;
  editRouteNo: any;

  constructor(
    private fb : FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef:  MatDialogRef<AddRouteComponent>,
    private route:ActivatedRoute
    ) {
      this.id = data.id;
      this.title = data.title;
      this.routeNo = data.routeNo;
      this.description = data.description;
      this.departure = data.departure;
      this.arrival = data.arrival;
      this.buttonName = data.buttonName;
    }

  ngOnInit(): void {
    this.routeRegister = this.fb.group({
      id:[this.id, []],
      routeNo:[this.routeNo, [Validators.required]],
      description: [this.description, [Validators.required]],
      departure: [this.departure, [Validators.required]],
      arrival:[this.arrival, [Validators.required]],
      busStops:this.fb.array([])
    })
  }

  cancelRegistration(){
    this.dialogRef.close()
  }

  registerBusRoute(){
    this.dialogRef.close(this.routeRegister.getRawValue());
  }

  addBusStops(lat:any, lng:any, title:String, address: String, sublocal:String){
    this.formBusStop=this.routeRegister.get("busStops") as FormArray;
    if(sublocal==undefined||sublocal==""){
      sublocal=address.split(/\s/)[0];
    }
    this.formBusStop.push(this.generatorRow(Number(lat), Number(lng),title,address,sublocal));
    this.updateDepartureAndArrival();
  }

  generatorRow(lat: any, lng:any, title: String, address:String, sublocal:String){
    return this.fb.group({
      busStopID: '',
      busRouteNo:this.fb.control(this.routeRegister.value.routeNo),
      busStop:new FormControl({
        value: title,
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

  get allBusStops(){
    return this.routeRegister.get("busStops") as FormArray;
  }

  removeBusStop(index:any){
    if (confirm('do you want to remove this bus stop?')){
      this.formBusStop=this.routeRegister.get("busStops") as FormArray;
      this.formBusStop.removeAt(index);
      this.updateMarkers(index, this.markers)
      this.updateFormBusStop(this.formBusStop, index);
      this.updateDepartureAndArrival()
    }
  }

  updateFormBusStop(formBusStop: FormArray<any>, index: any) {
    for(var i = index; i < formBusStop.length; i++) {
      formBusStop.at(i).patchValue({busStop:this.markers[i].title})
    }
  }

  //set destination to the first bus stop name
  updateDepartureAndArrival(){
    this.routeRegister.controls['departure'].setValue(this.formBusStop.at(0).getRawValue().name);
    this.routeRegister.controls['arrival'].setValue(this.formBusStop.at(this.formBusStop.length-1).getRawValue().name);
  }

  /////////////////////////// GOOGLE MAP METHODS /////////////////////////////////
  //Mouse move in map
  move(event: google.maps.MapMouseEvent){
    if(event.latLng!= null){
      this.display = (event.latLng.toJSON());
    }
  }

  // Markers
  async dropMarker(event:any) {
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    var locations = await this.getAddress(lat, lng);
    var address = locations.address;
    var title = "Bus Stop " + (this.markers.length + 1);
    this.markers.push({
      position: {
        lat: lat,
        lng: lng
      },
      label: {
        color: 'blue',
        text:  title,
      },
      title: title,
      info: address,
      options: {
        animation: google.maps.Animation.DROP,
      },
    })
    this.addBusStops(lat, lng, title, address, locations.sublocal);
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

  //update markers when removing one of them
  updateMarkers(index:number, markers:Array<any>){
    this.markers= this.markers.slice(0, index)
    let i =index;
    while(markers[i+1]!=null){
      this.markers.push({
        position: markers[i+1].position,
        label: {
          color: 'blue',
          text: "Bus Stop " + (i+ 1),
        },
        title: "Bus Stop " + (i + 1),
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
  /////////////////////////// END OF GOOGLE MAP METHODS /////////////////////////////////
}



