import { Component, DoCheck, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/service/data.service';
@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.css']
})
export class AddRouteComponent implements OnInit, DoCheck {

  constructor(
    private builder:FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar,
    private dataApi: DataService) { }
  ngDoCheck(): void {
    let currenturl = this.router.url;
    if (currenturl=='/dashboard/busRoute/create'){
      this.isListing2=true;
    }
    else{
      this.isListing2=false;
    }
  }

  isListing2 = true
  formBusStop !: FormArray<any>;

  ngOnInit(): void {
  }
  routeRegister= this.builder.group({
      routeNo:this.builder.control('', Validators.required),
      description:this.builder.control('', Validators.required),
      destination:this.builder.control('', Validators.required),
      arrival:this.builder.control('', Validators.required),
      busStops:this.builder.array([])
  });

  addBusStops(){
    this.formBusStop=this.routeRegister.get("busStops") as FormArray;
    this.formBusStop.push(this.generatorRow());
  }

  generatorRow(){
    return this.builder.group({
      busRouteNo:this.builder.control(this.routeRegister.value.routeNo),
      name:this.builder.control(''),
      address:this.builder.control(''),
      longitude:this.builder.control(''),
      latitude:this.builder.control(''),
    });
  }

  get allBusStops(){
    return this.routeRegister.get("busStops") as FormArray;
  }
  saveBusStop(){
    //
    if(this.routeRegister.valid){
      if(this.allBusStops.valid){
        console.log(this.routeRegister.value)
        this.dataApi.addBusRoute(this.routeRegister.value);
        this.snackbar.open('Bus route is registered successfully.','OK',{
          duration: 2000
        });
        this.router.navigateByUrl('/dashboard/busRoute')
      }
    }
  }

  removeBusStop(index:any){
    if (confirm('do you want to remove this bus stop?')){
      this.formBusStop=this.routeRegister.get("busStops") as FormArray;
      this.formBusStop.removeAt(index);
    }
  }
}
