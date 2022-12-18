import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BusStop } from 'src/app/shared/model/bus-stop';

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
  busStop!: FormArray<any>;
  dataSource!: MatTableDataSource<BusStop>;
  busStopForm!: FormGroup;
  displayedColumns: string[] = ['index', 'name', 'address', 'longitude', 'latitude'];
  constructor(
    private fb : FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef:  MatDialogRef<AddBusrouteComponent>
    ) {
      this.id = data.id;
      this.title = data.title;
      this.routeNo = data.routeNo;
      this.description = data.description;
      this.destination = data.destination;
      this.arrival = data.arrival;
      this.buttonName = data.buttonName;
      this.dataSource = new MatTableDataSource(data.busStops);
    }


  ngOnInit(): void {
    this.form = this.fb.group({
      id:[this.id, []],
      routeNo:[this.routeNo, [Validators.required]],
      description: [this.description, [Validators.required]],
      destination: [this.destination, [Validators.required]],
      arrival: [this.arrival, [Validators.required]],
      busStop: [this.busStop, [Validators.required]]
    })

    this.busStopForm = this.fb.group({
      name:this.fb.control(''),
      address:this.fb.control(''),
      longitude:this.fb.control(''),
      latitude:this.fb.control(''),
    })
  }

  cancelRegistration(){
    this.dialogRef.close()
  }

  registerBusRoute(){
    // this.dialogRef.close(this.form.value, this.busStopForm.value);
  }

}
