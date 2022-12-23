import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

      // this.busStops = data.busStops;  //hard-coded
    }


  ngOnInit(): void {
    this.getBusStops(this.id);
    this.form = this.fb.group({
      id:[this.id, []],
      routeNo:[this.routeNo, [Validators.required]],
      description: [this.description, [Validators.required]],
      destination: [this.destination, [Validators.required]],
      arrival: [this.arrival, [Validators.required]],
      busStops: this.fb.array([]),
      deletedbusStops:this.fb.array([])
    });
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
  }

  addBusStops(){
    this.busStopForm=this.form.get("busStops") as FormArray;
    this.busStopForm.push(this.generatorRow());
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

  generatorRow(){
    return this.fb.group({
      busStopID: "BusStop"+Math.floor(Math.random() * 1001),
      busRouteNo:this.fb.control(this.form.value.routeNo),
      name:this.fb.control(''),
      address:this.fb.control(''),
      longitude:this.fb.control(''),
      latitude:this.fb.control('')
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
