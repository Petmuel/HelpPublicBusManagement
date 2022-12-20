import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Data } from '@angular/router';
import { BusStop } from 'src/app/shared/model/bus-stop';
import { DataService } from 'src/app/shared/service/data.service';

@Component({
  selector: 'app-add-busroute',
  templateUrl: './add-busroute.component.html',
  styleUrls: ['./add-busroute.component.css']
})
export class AddBusrouteComponent implements OnInit {

  form !: FormGroup;
  title!: string;
  routeNo !: string;
  description !: string;
  destination !: string;
  arrival !: string;
  id !: string;
  buttonName!: string;
  busStops!: any
  busStopsArr!: any;
  busStopForm!: FormArray<any>;
  displayedColumns: string[] = ['index', 'name', 'address', 'longitude', 'latitude'];
  constructor(
    private fb : FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dataApi: DataService,
    private dialogRef:  MatDialogRef<AddBusrouteComponent>
    ) {
      this.id = data.id;
      this.title = data.title;
      this.routeNo = data.routeNo;
      this.description = data.description;
      this.destination = data.destination;
      this.arrival = data.arrival;
      this.buttonName = data.buttonName;
      this.busStops = data.busStops;  //hard-coded
    }


  ngOnInit(): void {
    this.getBusStops(this.id);

    this.form = this.fb.group({
      id:[this.id, []],
      routeNo:[this.routeNo, [Validators.required]],
      description: [this.description, [Validators.required]],
      destination: [this.destination, [Validators.required]],
      arrival: [this.arrival, [Validators.required]],
      busStops: this.fb.array([])
    })
    //retrieve bus stop doc and add into the list
    for(let busStop of this.busStops){
      this.addStops(busStop);
    }
  }

  cancelRegistration(){
    this.dialogRef.close()
  }

  registerBusRoute(){
    // this.dialogRef.close(this.form.value, this.busStopForm.value);
  }

  addStops(stop:any){
    this.busStopForm=this.form.get("busStops") as FormArray;
    this.busStopForm.push(this.row(stop));
  }

  addBusStops(){
    this.busStopForm=this.form.get("busStops") as FormArray;
    this.busStopForm.push(this.generatorRow());
  }

  row(stop:any){
    return this.fb.group({
      busRouteNo:this.fb.control(stop.routeNo),
      name:this.fb.control(stop.name),
      address:this.fb.control(stop.address),
      longitude:this.fb.control(stop.longitude),
      latitude:this.fb.control(stop.latitude),
    });
  }

  generatorRow(){
    return this.fb.group({
      busRouteNo:this.fb.control(this.form.value.routeNo),
      name:this.fb.control(''),
      address:this.fb.control(''),
      longitude:this.fb.control(''),
      latitude:this.fb.control(''),
    });
  }

  get allBusStops(){
    return this.form.get("busStops") as FormArray;
  }

  removeBusStop(index:any){
    if (confirm('do you want to remove this bus stop?')){
      this.busStopForm=this.form.get("busStops") as FormArray;
      this.busStopForm.removeAt(index);
    }
  }

  getBusStops(id:string){
    this.dataApi.getBusStopsByRoute(id).subscribe(res=>{
      this.busStops=res.map((e:any)=>{
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      })
       console.log('busStops', this.busStops);
    })
  }
}
