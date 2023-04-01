// import { Component, DoCheck, OnInit } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Router } from '@angular/router';
// import { DataService } from 'src/app/shared/service/data.service';
// @Component({
//   selector: 'app-add-route',
//   templateUrl: './add-route.component.html',
//   styleUrls: ['./add-route.component.css']
// })
// export class AddRouteComponent implements OnInit, DoCheck {

//   constructor(
//     private builder:FormBuilder,
//     private router: Router,
//     private snackbar: MatSnackBar,
//     private dataApi: DataService) { }
//   ngDoCheck(): void {
//     let currenturl = this.router.url;
//     if (currenturl=='/dashboard/busRoute/create'){
//       this.isListing2=true;
//     }
//     else{
//       this.isListing2=false;
//     }
//   }

//   isListing2 = true
//   formBusStop !: FormArray<any>;

//   ngOnInit(): void {
//   }
//   routeRegister= this.builder.group({
//       routeNo:this.builder.control('', Validators.required),
//       description:this.builder.control('', Validators.required),
//       destination:this.builder.control('', Validators.required),
//       arrival:this.builder.control('', Validators.required),
//       busStops:this.builder.array([])
//   });

//   addBusStops(){
//     this.formBusStop=this.routeRegister.get("busStops") as FormArray;
//     this.formBusStop.push(this.generatorRow());
//   }

//   generatorRow(){
//     return this.builder.group({
//       busRouteNo:this.builder.control(this.routeRegister.value.routeNo),
//       name:this.builder.control(''),
//       address:this.builder.control(''),
//       longitude:this.builder.control(''),
//       latitude:this.builder.control(''),
//     });
//   }

//   get allBusStops(){
//     return this.routeRegister.get("busStops") as FormArray;
//   }
//   saveBusStop(){
//     //
//     if(this.routeRegister.valid){
//       if(this.allBusStops.valid){
//         console.log(this.routeRegister.value)
//         this.dataApi.addBusRoute(this.routeRegister.value);
//         this.snackbar.open('Bus route saved successfully.','OK',{
//           duration: 2000
//         });
//         this.router.navigateByUrl('/dashboard/busRoute')
//       }
//     }
//   }

//   removeBusStop(index:any){
//     if (confirm('do you want to remove this bus stop?')){
//       this.formBusStop=this.routeRegister.get("busStops") as FormArray;
//       this.formBusStop.removeAt(index);
//     }
//   }
// }

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

  //Mouse move in map
  move(event: google.maps.MapMouseEvent){
    if(event.latLng!= null){
      this.display = (event.latLng.toJSON());
    }
  }

  // Markers
  dropMarker(event:any) {
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();

    var title = 'Bus Stop ' + (this.markers.length + 1);
    this.markers.push({
      position: {
        lat: lat,
        lng: lng
      },
      label: {
        color: 'blue',
        text: title,
      },
      title: title,
      info: title,
      options: {
        animation: google.maps.Animation.DROP,
      },
    })
    this.addBusStops(lat, lng, title);

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
        info: 'Bus Stop ' + (i + 1),
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

  openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;
    this.info.open(marker)
  }

routeRegister !: FormGroup;
  title!: string;
  routeNo !: string;
  description !: string;
  destination !: string;
  arrival !: string;
  id !: string;
  buttonName!: string;
  stops!: FormArray<any>;
  formBusStop !: FormArray<any>;
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
      this.destination = data.destination;
      this.arrival = data.arrival;
      this.buttonName = data.buttonName;
    }

  /*google maps
  map !:google.maps.Map;
  mcenter!: google.maps.LatLngLiteral;
  options:google.maps.MapOptions={
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel:true,
    disableDefaultUI:true,
    disableDoubleClickZoom:true,
    zoom:10
  }
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow|undefined;
  markerLocation:string="";
  display:any;
  center: google.maps.LatLngLiteral={lat:3.068  , lng: 101.60};
  zoom=10;
  markerOptions: google.maps.MarkerOptions={draggable: false};
  markerPositions: google.maps.LatLngLiteral[]=[]


  moveMap(event: google.maps.MapMouseEvent){
    if(event.latLng!= null){
      this.center = (event.latLng.toJSON());
    }
  }

  addMarker(event: google.maps.MapMouseEvent){
    var LAT = event.latLng?.lat().toFixed(3);
    var LNG = event.latLng?.lng().toFixed(3)
    if(event.latLng!= null){
      let url=`https://maps.googleapis.com/maps/api/geocode/json?latlng=${LAT},${LNG}`;
      this.markerPositions.push(event.latLng.toJSON());
      fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log(data);
        })
    }
    this.addBusStops(event.latLng?.lat().toFixed(3), event.latLng?.lng().toFixed(3));
  }

  openInfoWindow(marker: MapMarker){
    if(this.infoWindow!=undefined){
      this.infoWindow.open(marker);
      this.markerLocation=
        "Lat: "+ marker.getPosition()?.lat().toFixed(3)+
        ", Long: "+ marker.getPosition()?.lng().toFixed(3);
    }
  }

  move(event: google.maps.MapMouseEvent){
    if(event.latLng!= null){
      this.display = (event.latLng.toJSON());
    }
  }
  autocomplete!: google.maps.places.Autocomplete;
  initAutocomplete(){

    const input = document.getElementById("ship-address") as HTMLInputElement;
    const options = {
      componentRestrictions: { country: "MY" },
      fields: ["address_components", "geometry", "icon", "name"],
      types: ["establishment"],
    };

    this.autocomplete = new google.maps.places.Autocomplete(input, options);
  }
*/
  ngOnInit(): void {
    // navigator.geolocation.getCurrentPosition((position) => {
    //   this.center = {
    //     lat: position.coords.latitude,
    //     lng: position.coords.longitude,
    //   }
    // })
    this.routeRegister = this.fb.group({
      id:[this.id, []],
      routeNo:[this.routeNo, [Validators.required]],
      description: [this.description, [Validators.required]],
      destination: [this.destination, [Validators.required]],
      arrival: [this.arrival, [Validators.required]],
      busStops:this.fb.array([])
    })

    // const portalDiv = document.getElementById('map_canvas')!;
    // navigator.geolocation.getCurrentPosition(position=>{
    //   this.center;
    // })

    // this.map=new google.maps.Map(portalDiv,{
    //   ...this.options,
    //   center: this.center
    // })
  }

  cancelRegistration(){
    this.dialogRef.close()
  }

  registerBusRoute(){
    this.dialogRef.close(this.routeRegister.getRawValue());
  }

    addBusStops(lat:any, lng:any, title:String){
    this.formBusStop=this.routeRegister.get("busStops") as FormArray;
    this.formBusStop.push(this.generatorRow(Number(lat), Number(lng),title));
  }

  generatorRow(lat: any, lng:any, title: String){
    return this.fb.group({
      busStopID: '',
      busRouteNo:this.fb.control(this.routeRegister.value.routeNo),
      name:new FormControl({
        value: title,
        disabled: true
      }),
      address:this.fb.control(''),
      longitude:new FormControl({
        value: lat,
        disabled: true
      }),
      latitude:new FormControl({
        value: lng,
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
    }

    // var num=0;
    // for(var mark of this.markers){
    //   mark.label.text = 'Bus Stop ' + (++num);
    //   console.log(mark.label)
    // }
  }

  updateFormBusStop(formBusStop: FormArray<any>, index: any) {
    for(var i = index; i < formBusStop.length; i++) {
      formBusStop.at(i).patchValue({name:this.markers[i].title})
    }
  }

  updateRoute(){
    let word="you"

    return word;
  }
}



